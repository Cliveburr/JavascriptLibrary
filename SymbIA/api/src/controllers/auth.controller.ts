import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const authService = new AuthService();

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
      const { username, password } = registerSchema.parse(req.body);
      const user = await authService.register({ username, password });
      res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Error registering user', error });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const result = await authService.login({ username, password });
      if (!result) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Error logging in', error });
      }
    }
  }
}
