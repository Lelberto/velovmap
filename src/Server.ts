import * as Express from 'express';
import * as http from 'http';
import { ServiceContainer } from './services/Service';
import Controller from './controllers/Controller';
import MongoDBService from './services/MongoDBService';
import DataRetrieveService from './services/DataRetrieveService';
import HomepageController from './controllers/HomepageController';
import SocketService from './services/SocketService';
import ConfigurationService from './services/ConfigurationService';

/**
 * Classe gérant le serveur.
 * 
 * Le serveur est le composant principal de l'application.
 */
export default class Server {

    public static INSTANCE: Server;

    /**
     * Retourne l'instance du serveur (Singleton).
     * 
     * L'instance sera créée quand cette méthode sera appelée pour la première fois.
     */
    public static getInstance(): Server {
        if (!Server.INSTANCE) {
            Server.INSTANCE = new Server();
        }
        return Server.INSTANCE;
    }

    public readonly http: http.Server;
    public readonly app: Express.Application;
    public readonly container: ServiceContainer;
    public readonly controllers: Controller[];

    /**
     * Construit un nouveau serveur.
     */
    private constructor() {
        this.app = this.createExpressApplication();
        this.http = this.createHTTP();
        this.container = this.createServiceContainer();
        this.controllers = this.createControllers();
    }

    /**
     * Démarre le serveur.
     * 
     * @param port Port d'écoute (80 par défaut)
     */
    public start(port: number = 80): void {
        this.container.mongodb.connect().then(() => {
            console.log('Connected to MongoDB Database');

            this.http.listen(port, () => {
                console.log(`Server is listening on port ${port}`);

                this.container.socket.start().then(() => console.log('Socket is started'));
            });
            
            this.container.dataRetrieve.updateInterval(10 * 60 * 1000);
        }).catch(console.error);
    }

    /**
     * Crée l'application Express.
     * 
     * @returns Application Express créée
     */
    private createExpressApplication(): Express.Application {
        const app = Express();

        // Moteur de vues
        app.set('view engine', 'twig');
        app.set('twig options', {
            allow_async: true,
            strict_variables: false
        });

        // Routes vers les assets
        app.set('views', 'public/views');
        app.use('/static', Express.static('public'));

        return app;
    }

    /**
     * Crée le serveur HTTP.
     * 
     * @returns Serveur HTTP créé
     */
    private createHTTP(): http.Server {
        return new http.Server(this.app);
    }

    /**
     * Crée le conteneur de services.
     * 
     * @returns Conteneur de services créé
     */
    private createServiceContainer(): ServiceContainer {
        const container: ServiceContainer = {};
        
        container.config = new ConfigurationService(container);
        container.dataRetrieve = new DataRetrieveService(container);
        container.mongodb = new MongoDBService(container);
        container.socket = new SocketService(container);

        return container;
    }

    /**
     * Crée les contrôleurs.
     * 
     * @returns Contrôleurs créés
     */
    private createControllers(): Controller[] {
        const controllers: Controller[] = [
            new HomepageController(this.container)
        ];
        
        // Ajout des routeurs Express des contrôleurs à l'application Express
        for (const controller of controllers) {
            this.app.use(controller.rootPath, controller.router);
            console.log(`Using ${controller.constructor.name} for ${controller.rootPath}`);
        }

        return controllers;
    }
}