import Service, { ServiceContainer } from "./Service";
import * as MongoDB from 'mongodb';
import Schema from "../schemas/Schema";

/**
 * Classe gérant le service de la base de données MongoDB.
 */
export default class MongoDBService extends Service {

    private readonly mongo: MongoDB.MongoClient;

    /**
     * Construit un nouveau service de la base de données MongoDB.
     * 
     * @param container Conteneur de services
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.mongo = new MongoDB.MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
    }

    /**
     * Effectue une connextion vers la base de données.
     * 
     * @async
     */
    public async connect(): Promise<void> {
        await this.mongo.connect();
    }

     /**
     * Effectue une déconnextion de la base de données.
     * 
     * @async
     */
    public async disconnect(): Promise<void> {
        await this.mongo.close();
    }

    /**
     * Retourne une collection spécifique.
     * 
     * @param collectionName Nom de la collection à retourner
     */
    public getCollection<T extends Schema>(collectionName: 'districts' | 'stations' | 'interests'): MongoDB.Collection<T> {
        return this.mongo.db('velovmap').collection<T>(collectionName);
    }
}