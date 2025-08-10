import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { MongoDBService } from '../database/mongodb.service';
import { ConfigService } from './config.service';
import { v6 } from 'uuid';
import { MemoryEntity, UserEntity } from '../entities';

interface AuthResult {
    user: UserEntity;
    token: string;
    refreshToken: string;
}

interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

interface RefreshTokenPayload {
    userId: string;
    tokenId: string;
    iat?: number;
    exp?: number;
}

export class AuthService {
    constructor(
        private mongoService: MongoDBService,
        private configService: ConfigService
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
        const userId = new ObjectId();
        const now = new Date();

        const user: UserEntity = {
            _id: userId,
            username,
            email,
            passwordHash,
            createdAt: now,
            updatedAt: now
        };

        // Create default memory
        const defaultMemory: MemoryEntity = {
            _id: <any>undefined,
            userId,
            name: 'Default Memory',
            vectorDatabase: `${userId}_${v6(undefined, undefined, Date.now())}`,
            totalChatCreated: 0,
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

    async validateToken(token: string): Promise<UserEntity | null> {
        try {
            const authConfig = this.configService.getAuthConfig();
            const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;

            await this.mongoService.connect();
            const usersCollection = this.mongoService.getUsersCollection();
            const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

            return user || null;
        } catch (error) {
            return null;
        }
    }

    async refreshToken(refreshToken: string): Promise<AuthResult | null> {
        try {
            const authConfig = this.configService.getAuthConfig();
            const decoded = jwt.verify(refreshToken, authConfig.jwtRefreshSecret) as RefreshTokenPayload;

            await this.mongoService.connect();
            const usersCollection = this.mongoService.getUsersCollection();
            const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

            if (!user) {
                return null;
            }

            return {
                user,
                token: this.generateToken(user),
                refreshToken: this.generateRefreshToken(user)
            };
        } catch (error) {
            return null;
        }
    }

    private generateToken(user: UserEntity): string {
        const authConfig = this.configService.getAuthConfig();
        const payload = {
            userId: user._id.toString()
        };

        const options: any = { expiresIn: authConfig.jwtExpiresIn };
        return jwt.sign(payload, authConfig.jwtSecret, options);
    }

    private generateRefreshToken(user: UserEntity): string {
        const authConfig = this.configService.getAuthConfig();
        const payload = {
            userId: user._id.toString(),
            tokenId: new ObjectId().toString()
        };

        const refreshOptions: any = { expiresIn: authConfig.jwtRefreshExpiresIn };
        return jwt.sign(payload, authConfig.jwtRefreshSecret, refreshOptions);
    }
}
