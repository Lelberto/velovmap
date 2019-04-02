import DataRetrieveService from "./DataRetrieveService";
import SocketService from "./SocketService";
import ConfigurationService from "./ConfigurationService";
import MongoDBService from "./MongoDBService";

/**
 * Classe gérant les services.
 * 
 * Un service est un composant pouvant être utilisé par d'autres services et par les contrôleurs.
 */
export default abstract class Service {

    protected readonly container: ServiceContainer;

    /**
     * Construit un nouveau service.
     * 
     * @param container Conteneur de services
     */
    public constructor(container: ServiceContainer) {
        this.container = container;
    }
}



/**
 * Interface gérant le conteneur de services.
 */
export interface ServiceContainer {
    config?: ConfigurationService;
    dataRetrieve?: DataRetrieveService;
    mongodb?: MongoDBService;
    socket?: SocketService;
}