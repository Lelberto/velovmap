import * as mysql from 'mysql2';
import Service, { ServiceContainer } from "./Service";

/**
 * Classe gérant le service de la base de données MySQL.
 */
export default class MySQLService extends Service {

    private readonly connection: any;
    
    /**
     * Construit un nouveau service de la base de données MySQL.
     * 
     * @param container Conteneur de services
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.connection = /* this.createConnection() */ null;
    }

    /**
     * Effectue une connexion vers la base de données.
     */
    public async connect(): Promise<void> { /* Méthode fake */ }

    /**
     * Effectue une déconnexion de la base de données.
     */
    public async disconnect(): Promise<void> { /* Méthode fake */ }

    /**
     * Exécute une requête.
     */
    public async query(query: string): Promise<void> { /* Méthode fake */ }

    /**
     * Crée la connexion.
     * 
     * @returns Connexion créée
     */
    private createConnection(): any {
        return mysql.createConnection({
            host: this.container.config.databases.mysql.host,
            port: this.container.config.databases.mysql.port,
            user: this.container.config.databases.mysql.user,
            password: this.container.config.databases.mysql.password,
            database: 'velovmap'
        });
    }
}