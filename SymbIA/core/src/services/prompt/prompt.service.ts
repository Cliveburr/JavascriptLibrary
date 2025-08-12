import { MongoDBService } from '../../database/mongodb.service';
import { ObjectId } from 'mongodb';
import { PromptConfiguration, PromptSet, PromptTestResult } from '../../entities';




export class PromptService {

    constructor(
        private mongodbService: MongoDBService
    ) {
        // Ensure MongoDB connection
        this.mongodbService.connect().catch(console.error);
    }

    async getPromptConfiguration(): Promise<PromptConfiguration | null> {
        const collection = this.mongodbService.getDatabase().collection<PromptConfiguration>('promptConfigurations');
        return await collection.findOne({});
    }

    async ensurePromptConfiguration(actualPromptSetId?: ObjectId): Promise<PromptConfiguration> {
        const collection = this.mongodbService.getDatabase().collection<PromptConfiguration>('promptConfigurations');
        const existing = await collection.findOne({});
        if (existing) return existing;
        if (!actualPromptSetId) {
            // If no id provided, create a placeholder ObjectId that won't match any set until explicitly set
            actualPromptSetId = new ObjectId();
        }
        const doc: PromptConfiguration = {
            _id: new ObjectId(),
            actualPromptSetId
        } as any;
        await collection.insertOne(doc as any);
        return doc;
    }

    async getPromptSet(promptSetId: ObjectId): Promise<PromptSet | null> {
        const collection = this.mongodbService.getDatabase().collection<PromptSet>('promptSets');
        return await collection.findOne({ _id: promptSetId });
    }

    async listPromptSets(): Promise<PromptSet[]> {
        const collection = this.mongodbService.getDatabase().collection<PromptSet>('promptSets');
        return await collection.find().toArray();
    }

    async createPromptSet(data: Omit<PromptSet, '_id' | 'fromTunningId' | 'promptTestResultIds'> & { fromTunningId?: ObjectId; }): Promise<PromptSet> {
        const collection = this.mongodbService.getDatabase().collection<PromptSet>('promptSets');
        const toInsert: PromptSet = {
            _id: new ObjectId(),
            alias: data.alias,
            observation: data.observation,
            manualVersion: data.manualVersion,
            tuningVersion: data.tuningVersion,
            isForTunning: data.isForTunning,
            prompts: data.prompts,
            fromTunningId: data.fromTunningId,
            promptTestResultIds: []
        } as any;
        await collection.insertOne(toInsert as any);
        return toInsert;
    }

    async updatePromptSet(promptSetId: ObjectId, data: Partial<Omit<PromptSet, '_id' | 'promptTestResultIds'>>): Promise<PromptSet | null> {
        const collection = this.mongodbService.getDatabase().collection<PromptSet>('promptSets');
        const update: any = { ...data };
        // Never allow direct mutation of promptTestResultIds here
        delete update.promptTestResultIds;
        await collection.updateOne({ _id: promptSetId }, { $set: update });
        return await collection.findOne({ _id: promptSetId });
    }

    async deletePromptSet(promptSetId: ObjectId): Promise<boolean> {
        const collection = this.mongodbService.getDatabase().collection<PromptSet>('promptSets');
        const res = await collection.deleteOne({ _id: promptSetId });
        return res.deletedCount === 1;
    }

    async setActualPromptSet(promptSetId: ObjectId): Promise<void> {
        await this.ensurePromptConfiguration(promptSetId);
        const collection = this.mongodbService.getDatabase().collection<PromptConfiguration>('promptConfigurations');
        await collection.updateOne({}, { $set: { actualPromptSetId: promptSetId } }, { upsert: true });
    }

    async getPromptSetSummaries(): Promise<Array<{
        _id: ObjectId;
        alias: string;
        observation: string;
        manualVersion: number;
        tuningVersion: number;
        isForTunning: boolean;
        promptsCount: number;
        testsCount: number;
        totalRequests: number;
        totalSuccess: number;
        allPassed: boolean;
        isCurrent: boolean;
    }>> {
        const db = this.mongodbService.getDatabase();
        const setsCol = db.collection<PromptSet>('promptSets');
        const resultsCol = db.collection<PromptTestResult>('promptTestResults');
        const config = await this.getPromptConfiguration();
        const sets = await setsCol.find().toArray();

        const summaries = await Promise.all(sets.map(async (set) => {
            const results = await resultsCol.find({ promptSetId: set._id }).toArray();
            let totalRequests = 0;
            let totalSuccess = 0;
            for (const r of results) {
                for (const it of r.iterations) {
                    for (const req of it.requests) {
                        totalRequests += 1;
                        if (req.isSuccess) totalSuccess += 1;
                    }
                }
            }
            const allPassed = totalRequests > 0 && totalRequests === totalSuccess;
            return {
                _id: set._id,
                alias: set.alias,
                observation: set.observation,
                manualVersion: set.manualVersion,
                tuningVersion: set.tuningVersion,
                isForTunning: set.isForTunning,
                promptsCount: set.prompts?.length || 0,
                testsCount: results.length,
                totalRequests,
                totalSuccess,
                allPassed,
                isCurrent: !!config && String(config.actualPromptSetId) === String(set._id)
            };
        }));

        return summaries;
    }
}