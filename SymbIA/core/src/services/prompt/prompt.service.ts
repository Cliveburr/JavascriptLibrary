import { MongoDBService } from '../../database/mongodb.service';
import { ObjectId } from 'mongodb';
import { PromptConfiguration, PromptSet } from '../../entities';




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

    async getPromptSet(promptSetId: ObjectId): Promise<PromptSet | null> {
        const collection = this.mongodbService.getDatabase().collection<PromptSet>('promptSets');
        return await collection.findOne({ _id: promptSetId });
    }

}