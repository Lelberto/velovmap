import Service, { ServiceContainer } from "./Service";
import * as mongodb from 'mongodb';

export default class MongoDBService extends Service {

    public constructor(container: ServiceContainer) {
        super(container);
    }
}