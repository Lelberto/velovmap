import Service, { ServiceContainer } from "./Service";
import Schema from "../schemas/Schema";
import { MongoClient, Collection, MongoClientOptions } from "mongodb";

/**
 * Classe gérant le service de la base de données MongoDB.
 */
export default class MongoDBService extends Service {

    private readonly mongo: MongoClient;

    /**
     * Construit un nouveau service de la base de données MongoDB.
     * 
     * @param container Conteneur de services
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.mongo = this.createMongo();
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
    public getCollection<T extends Schema>(collectionName: 'districts' | 'stations' | 'interests'): Collection<T> {
        return this.mongo.db('velovmap').collection<T>(collectionName);
    }

    /**
     * Crée le client MongoDB.
     * 
     * @returns Client MongoDB créé
     */
    private createMongo(): MongoClient {
        const config = this.container.config.databases.mongodb;
        const options: MongoClientOptions = { useNewUrlParser: true };

        if (config.user) { // S'il y a une authentification à effectuer
            options.auth = {
                user: config.user,
                password: config.password
            }
            console.log(`MongoDB authentication with user ${config.user}`);
        } else { // S'il n'y a pas d'authentification à effectuer
            console.log('No MongoDB authentication');
        }

        return new MongoClient(`mongodb://${config.host}:${config.port}`, options);
    }
}