import { QdrantClient } from '@qdrant/js-client-rest';
import { ConfigService } from '../services/config.service.js';

export interface QdrantConfig {
    url?: string;
    apiKey?: string;
}

export enum VectorContentType {
    PlainText
}

export type VectorContentTypes = string;

export interface VectorPayload {
    keywords: string;
    timestamp: string;
    content?: {
        type: VectorContentType,
        value: VectorContentTypes;
    },
    [key: string]: any; // Index signature for Qdrant compatibility
}

export interface SearchFilter {
    type?: string;
    tags?: string[];
    timestampFrom?: string;
    timestampTo?: string;
    metadata?: Record<string, any>;
}

export interface SearchResult {
    id: string;
    score: number;
    payload: VectorPayload;
}

export class QdrantProvider {
    private client: QdrantClient;

    constructor(configService: ConfigService, config?: QdrantConfig) {
        const qdrantConfig = configService.getQdrantConfig();
        const url = config?.url || qdrantConfig.url;
        const apiKey = config?.apiKey || qdrantConfig.apiKey;

        const clientConfig: any = { url };
        if (apiKey) {
            clientConfig.apiKey = apiKey;
        }

        this.client = new QdrantClient(clientConfig);
    }

    async upsert(
        vectorDatabase: string,
        id: string,
        vector: number[],
        payload: VectorPayload
    ): Promise<void> {
        await this.ensureCollection(vectorDatabase, vector.length);

        await this.client.upsert(vectorDatabase, {
            wait: true,
            points: [
                {
                    id,
                    vector,
                    payload,
                },
            ],
        });
    }

    async search(
        vectorDatabase: string,
        vector: number[],
        topK: number = 10,
        filter?: SearchFilter
    ): Promise<SearchResult[]> {

        await this.ensureCollection(vectorDatabase, vector.length);

        // Build Qdrant filter
        const qdrantFilter = filter ? this.buildQdrantFilter(filter) : undefined;

        const searchResult = await this.client.search(vectorDatabase, {
            vector,
            limit: topK,
            with_payload: true,
            filter: qdrantFilter,
        });

        return searchResult.map((point: any) => ({
            id: String(point.id),
            score: point.score || 0,
            payload: point.payload as VectorPayload,
        }));
    }

    private async ensureCollection(collectionName: string, vectorSize: number): Promise<void> {
        // Check if collection exists
        const collections = await this.client.getCollections();
        const collectionExists = collections.collections.some(
            (collection: { name: string; }) => collection.name === collectionName
        );

        if (!collectionExists) {
            // Create collection with the specified vector size
            await this.client.createCollection(collectionName, {
                vectors: {
                    size: vectorSize,
                    distance: 'Cosine', // Use cosine similarity
                },
            });
        }
    }

    private buildQdrantFilter(filter?: SearchFilter): any {
        if (!filter) return undefined;

        const conditions: any[] = [];

        if (filter.type) {
            conditions.push({
                key: 'type',
                match: { value: filter.type },
            });
        }

        if (filter.tags && filter.tags.length > 0) {
            conditions.push({
                key: 'tags',
                match: { any: filter.tags },
            });
        }

        if (filter.timestampFrom) {
            conditions.push({
                key: 'timestamp',
                range: { gte: filter.timestampFrom },
            });
        }

        if (filter.timestampTo) {
            conditions.push({
                key: 'timestamp',
                range: { lte: filter.timestampTo },
            });
        }

        if (filter.metadata) {
            Object.entries(filter.metadata).forEach(([key, value]) => {
                conditions.push({
                    key: `metadata.${key}`,
                    match: { value },
                });
            });
        }

        if (conditions.length === 0) return undefined;
        if (conditions.length === 1) return conditions[0];

        return {
            must: conditions,
        };
    }
}
