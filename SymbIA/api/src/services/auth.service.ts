import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { MemoryService } from './memory.service';

// Carregar variáveis de ambiente
dotenv.config();

export class AuthService {
  private memoryService = new MemoryService();

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return secret;
  }

  async register(user: IUser): Promise<IUser> {
    if (!user.password) {
      throw new Error('Password is required for registration');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({ username: user.username, password: hashedPassword });
    await newUser.save();
    
    // Criar memória padrão para o novo usuário
    await this.memoryService.createDefaultMemory(newUser._id!.toString());
    
    return newUser;
  }

  async login(credentials: IUser): Promise<{ token: string } | null> {
    if (!credentials.password) {
      return null;
    }
    const user = await User.findOne({ username: credentials.username });
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const jwtSecret = this.getJwtSecret();
    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    return { token };
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      return null;
    }
  }
}
