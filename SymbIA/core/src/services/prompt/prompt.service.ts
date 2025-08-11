import { MongoDBService } from '../../database/mongodb.service';




export class PromptService {

    constructor(
        private mongodbService: MongoDBService
    ) {
        // Ensure MongoDB connection
        this.mongodbService.connect().catch(console.error);
    }


}