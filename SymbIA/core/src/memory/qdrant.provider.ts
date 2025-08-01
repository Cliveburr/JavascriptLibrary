import { QdrantClient } from '@qdrant/js-client-rest';
import { ConfigService } from '../config/config.service.js';

export interface QdrantConfig {
    url?: string;
    apiKey?: string;
}

export interface VectorPayload {
    type: string;
    tags?: string[];
    timestamp: string;
    content?: string;
    metadata?: Record<string, any>;
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
        memoryId: string,
        id: string,
        vector: number[],
        payload: VectorPayload
    ): Promise<void> {
        try {
            // Ensure collection exists
            await this.ensureCollection(memoryId, vector.length);

            // Upsert point
            await this.client.upsert(memoryId, {
                wait: true,
                points: [
                    {
                        id,
                        vector,
                        payload,
                    },
                ],
            });
        } catch (error) {
            throw new Error(`Failed to upsert vector to Qdrant: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async search(
        memoryId: string,
        vector: number[],
        topK: number = 10,
        filter?: SearchFilter
    ): Promise<SearchResult[]> {
        try {
            // Check if collection exists
            const collections = await this.client.getCollections();
            const collectionExists = collections.collections.some(
                (collection: { name: string; }) => collection.name === memoryId
            );

            if (!collectionExists) {
                return []; // Return empty results if collection doesn't exist
            }

            // Build Qdrant filter
            const qdrantFilter = this.buildQdrantFilter(filter);

            const searchResult = await this.client.search(memoryId, {
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
        } catch (error) {
            throw new Error(`Failed to search vectors in Qdrant: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async ensureCollection(collectionName: string, vectorSize: number): Promise<void> {
        try {
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
        } catch (error) {
            throw new Error(`Failed to ensure collection exists: ${error instanceof Error ? error.message : String(error)}`);
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
