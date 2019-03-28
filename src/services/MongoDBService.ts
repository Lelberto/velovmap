import Service, { ServiceContainer } from "./Service";
import * as MongoDB from 'mongodb';
import Schema from "../schemas/Schema";

export default class MongoDBService extends Service {

    private readonly mongo: MongoDB.MongoClient;

    public constructor(container: ServiceContainer) {
        super(container);
        this.mongo = new MongoDB.MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
    }

    public async connect(): Promise<void> {
        await this.mongo.connect();
    }

    public async disconnect(): Promise<void> {
        await this.mongo.close();
    }

    public getCollection<T extends Schema>(collectionName: 'districts' | 'stations'): MongoDB.Collection<T> {
        return this.mongo.db('velovmap').collection<T>(collectionName);
    }
}