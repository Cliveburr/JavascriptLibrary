#!/usr/bin/env node
/**
 * Script para validar a configuração do SymbIA
 * Uso: node scripts/validate-config.js
 */

import dotenv from 'dotenv';
import { configureContainer, ConfigService } from '@symbia/core';
import { container } from 'tsyringe';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega o .env da pasta da API
dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('🔧 Validando configuração do SymbIA...\n');

try {
    // Configura o container DI
    configureContainer();

    // Resolve a configuração
    const configService = container.resolve(ConfigService);
    const config = configService.get();

    console.log('✅ Configuração válida!\n');

    console.log('📋 Resumo da configuração:');
    console.log(`  🌐 Servidor: localhost:${config.port}`);
    console.log(`  🗄️  MongoDB: ${config.mongodbUri}`);
    console.log(`  🔑 JWT Secret: ${config.jwtSecret.substring(0, 10)}...`);
    console.log(`  🔄 JWT Refresh Secret: ${config.jwtRefreshSecret.substring(0, 10)}...`);
    console.log(`  ⏰ JWT Expires: ${config.jwtExpiresIn}`);
    console.log(`  🔄 JWT Refresh Expires: ${config.jwtRefreshExpiresIn}`);
    console.log(`  🔍 Qdrant: ${config.qdrantUrl}`);
    console.log(`  🤖 Ollama: ${config.ollamaBaseUrl}`);
    console.log(`  🧠 OpenAI: ${config.openaiBaseUrl}`);

    if (config.qdrantApiKey) {
        console.log(`  🔐 Qdrant API Key: ${config.qdrantApiKey.substring(0, 10)}...`);
    } else {
        console.log(`  🔐 Qdrant API Key: não configurada (modo público)`);
    }

    if (config.openaiApiKey) {
        console.log(`  🔑 OpenAI API Key: ${config.openaiApiKey.substring(0, 10)}...`);
    } else {
        console.log(`  ⚠️  OpenAI API Key: não configurada (OpenAI não funcionará)`);
    }

    console.log('\n🎉 Configuração pronta para uso!');
    process.exit(0);

} catch (error) {
    console.error('❌ Erro na configuração:');
    console.error(`   ${error.message}\n`);

    console.log('💡 Dicas para resolver:');
    console.log('  1. Verifique se o arquivo .env existe na pasta api/');
    console.log('  2. Certifique-se que todas as variáveis obrigatórias estão definidas');
    console.log('  3. Verifique se as URLs são válidas');
    console.log('  4. Verifique se os formatos de tempo JWT são válidos (ex: 1h, 30m, 7d)');
    console.log('  5. Certifique-se que a PORT é um número entre 1-65535\n');

    console.log('📝 Variáveis obrigatórias:');
    console.log('  - PORT');
    console.log('  - MONGODB_URI');
    console.log('  - JWT_SECRET');
    console.log('  - JWT_REFRESH_SECRET');
    console.log('  - JWT_EXPIRES_IN');
    console.log('  - JWT_REFRESH_EXPIRES_IN');
    console.log('  - QDRANT_URL');
    console.log('  - OLLAMA_BASE_URL');
    console.log('  - OPENAI_BASE_URL');

    process.exit(1);
}
