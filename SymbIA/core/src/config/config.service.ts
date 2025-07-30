export interface AppConfig {
    // Server
    port: number;

    // Database
    mongodbUri: string;

    // Authentication
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;

    // Vector Database
    qdrantUrl: string;
    qdrantApiKey?: string;

    // LLM Providers
    ollamaBaseUrl: string;
    openaiApiKey?: string;
    openaiBaseUrl: string;
}

export class ConfigService {
    private config: AppConfig;

    constructor() {
        this.config = this.loadAndValidateConfig();
    }

    private loadAndValidateConfig(): AppConfig {
        const requiredVars = [
            'PORT',
            'MONGODB_URI',
            'JWT_SECRET',
            'JWT_REFRESH_SECRET',
            'JWT_EXPIRES_IN',
            'JWT_REFRESH_EXPIRES_IN',
            'QDRANT_URL',
            'OLLAMA_BASE_URL',
            'OPENAI_BASE_URL'
        ];

        const missingVars: string[] = [];

        for (const varName of requiredVars) {
            if (!process.env[varName]) {
                missingVars.push(varName);
            }
        }

        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Validate PORT is a valid number
        const port = parseInt(process.env.PORT!, 10);
        if (isNaN(port) || port <= 0 || port > 65535) {
            throw new Error('PORT must be a valid number between 1 and 65535');
        }

        // Validate URLs
        const urlFields = ['MONGODB_URI', 'QDRANT_URL', 'OLLAMA_BASE_URL', 'OPENAI_BASE_URL'];
        for (const field of urlFields) {
            try {
                new URL(process.env[field]!);
            } catch {
                throw new Error(`${field} must be a valid URL`);
            }
        }

        // Validate JWT expiration formats (should be valid for jsonwebtoken)
        const timeRegex = /^\d+[smhd]$|^\d+$/;
        if (!timeRegex.test(process.env.JWT_EXPIRES_IN!)) {
            throw new Error('JWT_EXPIRES_IN must be a valid time format (e.g., "1h", "30m", "7d")');
        }
        if (!timeRegex.test(process.env.JWT_REFRESH_EXPIRES_IN!)) {
            throw new Error('JWT_REFRESH_EXPIRES_IN must be a valid time format (e.g., "1h", "30m", "7d")');
        }

        return {
            port,
            mongodbUri: process.env.MONGODB_URI!,
            jwtSecret: process.env.JWT_SECRET!,
            jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
            jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
            jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
            qdrantUrl: process.env.QDRANT_URL!,
            qdrantApiKey: process.env.QDRANT_API_KEY,
            ollamaBaseUrl: process.env.OLLAMA_BASE_URL!,
            openaiApiKey: process.env.OPENAI_API_KEY,
            openaiBaseUrl: process.env.OPENAI_BASE_URL!
        };
    }

    get(): AppConfig {
        return this.config;
    }

    // Getters for specific config sections
    getServerConfig() {
        return {
            port: this.config.port
        };
    }

    getDatabaseConfig() {
        return {
            mongodbUri: this.config.mongodbUri
        };
    }

    getAuthConfig() {
        return {
            jwtSecret: this.config.jwtSecret,
            jwtRefreshSecret: this.config.jwtRefreshSecret,
            jwtExpiresIn: this.config.jwtExpiresIn,
            jwtRefreshExpiresIn: this.config.jwtRefreshExpiresIn
        };
    }

    getQdrantConfig() {
        return {
            url: this.config.qdrantUrl,
            apiKey: this.config.qdrantApiKey
        };
    }

    getOllamaConfig() {
        return {
            baseUrl: this.config.ollamaBaseUrl
        };
    }

    getOpenAIConfig() {
        return {
            apiKey: this.config.openaiApiKey,
            baseUrl: this.config.openaiBaseUrl
        };
    }
}
