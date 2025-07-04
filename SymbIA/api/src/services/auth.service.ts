import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
  async register(user: IUser): Promise<IUser> {
    if (!user.password) {
      throw new Error('Password is required for registration');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({ username: user.username, password: hashedPassword });
    await newUser.save();
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

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
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
