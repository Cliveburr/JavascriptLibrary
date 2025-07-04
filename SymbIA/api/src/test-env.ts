import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('Testing environment variables:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINED' : 'UNDEFINED');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'DEFINED' : 'UNDEFINED');
console.log('PORT:', process.env.PORT);

// Testar o AuthService
import { AuthService } from './services/auth.service';

async function testAuth() {
  try {
    const authService = new AuthService();
    console.log('✅ AuthService created successfully');
    
    // Teste de login com credenciais inválidas para verificar se não quebra
    const result = await authService.login({ username: 'test', password: 'test' });
    console.log('✅ Login method works (result:', result, ')');
    
  } catch (error) {
    console.error('❌ Error creating AuthService:', error);
  }
}

testAuth();
