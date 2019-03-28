import NoSQLDatabaseService from "./MongoDBService";
import DataRetrieveService from "./DataRetrieveService";

export default abstract class Service {

    protected readonly container: ServiceContainer;

    public constructor(container: ServiceContainer) {
        this.container = container;
    }
}

export interface ServiceContainer {
    dataRetrieve?: DataRetrieveService;
    mongodb?: NoSQLDatabaseService;
}