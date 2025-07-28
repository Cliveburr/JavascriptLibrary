import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const authService = new AuthService();

// Interface para respostas padronizadas
interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  status?: string;
  version?: string;
  timestamp?: string;
  uptime?: number;
  path?: string;
  details?: string;
}

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      console.log('Registration attempt for username:', username);
      console.log('MongoDB connection state:', mongoose.connection.readyState);
      
      // Verificar se o MongoDB está conectado
      if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB not connected. Connection state:', mongoose.connection.readyState);
        res.status(503).json({ 
          error: 'Database connection unavailable',
          details: 'Please try again later'
        });
        return;
      }
      
      if (!username || !password) {
        console.log('Missing username or password');
        res.status(400).json({ 
          error: 'Username and password are required' 
        });
        return;
      }

      if (username.length < 3) {
        console.log('Username too short');
        res.status(400).json({ 
          error: 'Username must be at least 3 characters long' 
        });
        return;
      }

      if (password.length < 6) {
        console.log('Password too short');
        res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        });
        return;
      }
      
      const newUser = await authService.register({ username, password });
      
      console.log('User registered successfully:', newUser.username);
      
      const response: ApiResponse = {
        message: 'User registered successfully',
        data: {
          username: newUser.username,
          id: newUser._id
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('Register endpoint error:', error);
      
      // Tratar erro de usuário duplicado
      if (error instanceof Error && error.message.includes('duplicate key error')) {
        res.status(400).json({ 
          error: 'Username already exists. Please choose a different username.',
          details: 'This username is already taken'
        });
        return;
      }
      
      // Tratar erro de validação do Mongoose
      if (error instanceof Error && error.name === 'ValidationError') {
        res.status(400).json({ 
          error: 'Validation error',
          details: error.message
        });
        return;
      }
      
      res.status(400).json({ 
        error: 'Failed to register user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ 
          error: 'Username and password are required' 
        });
        return;
      }
      
      const result = await authService.login({ username, password });
      
      if (!result) {
        res.status(401).json({ 
          error: 'Invalid credentials' 
        });
        return;
      }
      
      const response: ApiResponse = {
        message: 'Login successful',
        data: {
          token: result.token
        },
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      console.error('Login endpoint error:', error);
      res.status(500).json({ 
        error: 'Failed to login',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET;
      
      if (!secret) {
        res.status(500).json({ message: 'Server configuration error' });
        return;
      }
      
      try {
        const decoded = jwt.verify(token, secret) as any;
        const user = await authService.getUserById(decoded.id);
        
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const responseData = {
          success: true,
          data: {
            id: user._id,
            username: user.username,
            name: user.username // Usando username como nome por enquanto
          }
        };
        res.status(200).json(responseData);
      } catch (jwtError) {
        res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error getting user info', error });
    }
  }
}
