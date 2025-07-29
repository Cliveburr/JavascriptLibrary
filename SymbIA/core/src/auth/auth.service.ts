import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '@symbia/interfaces';
import { MongoDBService } from '../database/mongodb.service.js';

interface AuthResult {
    user: User;
    token: string;
    refreshToken: string;
}

@injectable()
export class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
    private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
    private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    constructor(
        @inject(MongoDBService) private mongoService: MongoDBService
    ) { }

    async register(username: string, email: string, password: string): Promise<AuthResult> {
        await this.mongoService.connect();

        const usersCollection = this.mongoService.getUsersCollection();
        const memoriesCollection = this.mongoService.getMemoriesCollection();

        // Check if user already exists
        const existingUser = await usersCollection.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            throw new Error('User with this email or username already exists');
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const userId = uuidv4();
        const defaultMemoryId = uuidv4();
        const now = new Date();

        const user: User = {
            id: userId,
            username,
            email,
            passwordHash,
            defaultMemoryId,
            createdAt: now,
            updatedAt: now
        };

        // Create default memory
        const defaultMemory = {
            id: defaultMemoryId,
            userId,
            name: 'Default Memory',
            createdAt: now
        };

        // Insert user and default memory
        await usersCollection.insertOne(user);
        await memoriesCollection.insertOne(defaultMemory);

        // Generate tokens
        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return {
            user,
            token,
            refreshToken
        };
    }

    async login(email: string, password: string): Promise<AuthResult | null> {
        await this.mongoService.connect();

        const usersCollection = this.mongoService.getUsersCollection();
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return null;
        }

        // Generate tokens
        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return {
            user,
            token,
            refreshToken
        };
    }

    async validateToken(token: string): Promise<User | null> {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as any;

            await this.mongoService.connect();
            const usersCollection = this.mongoService.getUsersCollection();
            const user = await usersCollection.findOne({ id: decoded.userId });

            return user || null;
        } catch (error) {
            return null;
        }
    }

    async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string; } | null> {
        try {
            const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as any;

            await this.mongoService.connect();
            const usersCollection = this.mongoService.getUsersCollection();
            const user = await usersCollection.findOne({ id: decoded.userId });

            if (!user) {
                return null;
            }

            return {
                token: this.generateToken(user),
                refreshToken: this.generateRefreshToken(user)
            };
        } catch (error) {
            return null;
        }
    }

    private generateToken(user: User): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username
            } as object,
            this.JWT_SECRET as string,
            { expiresIn: this.JWT_EXPIRES_IN as string }
        );
    }

    private generateRefreshToken(user: User): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username
            } as object,
            this.JWT_REFRESH_SECRET as string,
            { expiresIn: this.JWT_REFRESH_EXPIRES_IN as string }
        );
    }
}
