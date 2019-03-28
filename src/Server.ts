import * as Express from 'express';
import { ServiceContainer } from './services/Service';
import Controller from './controllers/Controller';
import MongoDBService from './services/MongoDBService';
import DataRetrieveService from './services/DataRetrieveService';

export default class Server {

    public static INSTANCE: Server;

    public static getInstance(): Server {
        if (!Server.INSTANCE) {
            Server.INSTANCE = new Server();
        }
        return Server.INSTANCE;
    }

    private readonly app: Express.Application;
    private readonly container: ServiceContainer;
    private readonly controllers: Controller[];

    private constructor() {
        this.app = this.createExpressApplication();
        this.container = this.createServiceContainer();
        this.controllers = this.createControllers();
    }

    public start(port: number = 80): void {
        this.app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
        
        this.container.dataRetrieve.updateDataInterval(5000);
    }

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
        app.set('/css', 'public/css');
        app.set('/js', 'public/js');
        app.set('/img', 'public/img');

        return app;
    }

    private createServiceContainer(): ServiceContainer {
        const container: ServiceContainer = {};
        
        container.dataRetrieve = new DataRetrieveService(container);
        container.mongodb = new MongoDBService(container);

        return container;
    }

    private createControllers(): Controller[] {
        return [];
    }
}