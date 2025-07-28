import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QdrantProvider, VectorPayload, SearchFilter } from '../src/memory/qdrant.provider';
import { QdrantClient } from '@qdrant/js-client-rest';

// Mock the QdrantClient
vi.mock('@qdrant/js-client-rest', () => ({
    QdrantClient: vi.fn().mockImplementation(() => ({
        upsert: vi.fn(),
        search: vi.fn(),
        getCollections: vi.fn(),
        createCollection: vi.fn(),
    })),
}));

describe('QdrantProvider', () => {
    let qdrantProvider: QdrantProvider;
    let mockClient: any;

    beforeEach(() => {
        vi.clearAllMocks();
        qdrantProvider = new QdrantProvider();
        mockClient = (qdrantProvider as any).client;
    });

    describe('upsert', () => {
        it('should create collection and upsert point successfully', async () => {
            const memoryId = 'test-memory';
            const id = 'test-id';
            const vector = [0.1, 0.2, 0.3];
            const payload: VectorPayload = {
                type: 'conversation',
                timestamp: '2025-01-01T00:00:00Z',
                content: 'Test content',
                tags: ['test'],
            };

            // Mock getCollections to return empty collections (collection doesn't exist)
            mockClient.getCollections.mockResolvedValue({
                collections: [],
            });

            // Mock createCollection
            mockClient.createCollection.mockResolvedValue({});

            // Mock upsert
            mockClient.upsert.mockResolvedValue({});

            await qdrantProvider.upsert(memoryId, id, vector, payload);

            // Verify collection creation was called
            expect(mockClient.createCollection).toHaveBeenCalledWith(memoryId, {
                vectors: {
                    size: 3,
                    distance: 'Cosine',
                },
            });

            // Verify upsert was called
            expect(mockClient.upsert).toHaveBeenCalledWith(memoryId, {
                wait: true,
                points: [
                    {
                        id,
                        vector,
                        payload,
                    },
                ],
            });
        });

        it('should not create collection if it already exists', async () => {
            const memoryId = 'test-memory';
            const id = 'test-id';
            const vector = [0.1, 0.2, 0.3];
            const payload: VectorPayload = {
                type: 'conversation',
                timestamp: '2025-01-01T00:00:00Z',
            };

            // Mock getCollections to return existing collection
            mockClient.getCollections.mockResolvedValue({
                collections: [{ name: memoryId }],
            });

            // Mock upsert
            mockClient.upsert.mockResolvedValue({});

            await qdrantProvider.upsert(memoryId, id, vector, payload);

            // Verify collection creation was NOT called
            expect(mockClient.createCollection).not.toHaveBeenCalled();

            // Verify upsert was called
            expect(mockClient.upsert).toHaveBeenCalledWith(memoryId, {
                wait: true,
                points: [
                    {
                        id,
                        vector,
                        payload,
                    },
                ],
            });
        });

        it('should throw error on upsert failure', async () => {
            const memoryId = 'test-memory';
            const id = 'test-id';
            const vector = [0.1, 0.2, 0.3];
            const payload: VectorPayload = {
                type: 'conversation',
                timestamp: '2025-01-01T00:00:00Z',
            };

            // Mock getCollections to return existing collection
            mockClient.getCollections.mockResolvedValue({
                collections: [{ name: memoryId }],
            });

            // Mock upsert to throw error
            mockClient.upsert.mockRejectedValue(new Error('Upsert failed'));

            await expect(
                qdrantProvider.upsert(memoryId, id, vector, payload)
            ).rejects.toThrow('Failed to upsert vector to Qdrant: Upsert failed');
        });
    });

    describe('search', () => {
        it('should return empty array if collection does not exist', async () => {
            const memoryId = 'test-memory';
            const vector = [0.1, 0.2, 0.3];

            // Mock getCollections to return empty collections
            mockClient.getCollections.mockResolvedValue({
                collections: [],
            });

            const results = await qdrantProvider.search(memoryId, vector, 10);

            expect(results).toEqual([]);
            expect(mockClient.search).not.toHaveBeenCalled();
        });

        it('should search and return results successfully', async () => {
            const memoryId = 'test-memory';
            const vector = [0.1, 0.2, 0.3];
            const topK = 5;

            // Mock getCollections to return existing collection
            mockClient.getCollections.mockResolvedValue({
                collections: [{ name: memoryId }],
            });

            // Mock search results
            const mockSearchResults = [
                {
                    id: 'result-1',
                    score: 0.95,
                    payload: {
                        type: 'conversation',
                        timestamp: '2025-01-01T00:00:00Z',
                        content: 'Test content 1',
                    },
                },
                {
                    id: 'result-2',
                    score: 0.89,
                    payload: {
                        type: 'memory',
                        timestamp: '2025-01-01T01:00:00Z',
                        content: 'Test content 2',
                    },
                },
            ];

            mockClient.search.mockResolvedValue(mockSearchResults);

            const results = await qdrantProvider.search(memoryId, vector, topK);

            expect(mockClient.search).toHaveBeenCalledWith(memoryId, {
                vector,
                limit: topK,
                with_payload: true,
                filter: undefined,
            });

            expect(results).toEqual([
                {
                    id: 'result-1',
                    score: 0.95,
                    payload: {
                        type: 'conversation',
                        timestamp: '2025-01-01T00:00:00Z',
                        content: 'Test content 1',
                    },
                },
                {
                    id: 'result-2',
                    score: 0.89,
                    payload: {
                        type: 'memory',
                        timestamp: '2025-01-01T01:00:00Z',
                        content: 'Test content 2',
                    },
                },
            ]);
        });

        it('should apply filters correctly', async () => {
            const memoryId = 'test-memory';
            const vector = [0.1, 0.2, 0.3];
            const topK = 5;
            const filter: SearchFilter = {
                type: 'conversation',
                tags: ['important'],
                timestampFrom: '2025-01-01T00:00:00Z',
            };

            // Mock getCollections to return existing collection
            mockClient.getCollections.mockResolvedValue({
                collections: [{ name: memoryId }],
            });

            mockClient.search.mockResolvedValue([]);

            await qdrantProvider.search(memoryId, vector, topK, filter);

            expect(mockClient.search).toHaveBeenCalledWith(memoryId, {
                vector,
                limit: topK,
                with_payload: true,
                filter: {
                    must: [
                        { key: 'type', match: { value: 'conversation' } },
                        { key: 'tags', match: { any: ['important'] } },
                        { key: 'timestamp', range: { gte: '2025-01-01T00:00:00Z' } },
                    ],
                },
            });
        });

        it('should throw error on search failure', async () => {
            const memoryId = 'test-memory';
            const vector = [0.1, 0.2, 0.3];

            // Mock getCollections to return existing collection
            mockClient.getCollections.mockResolvedValue({
                collections: [{ name: memoryId }],
            });

            // Mock search to throw error
            mockClient.search.mockRejectedValue(new Error('Search failed'));

            await expect(
                qdrantProvider.search(memoryId, vector, 10)
            ).rejects.toThrow('Failed to search vectors in Qdrant: Search failed');
        });
    });
});
