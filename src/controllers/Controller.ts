import { ServiceContainer } from "../services/Service";

export default abstract class Controller {

    protected readonly container: ServiceContainer;
    
    public constructor(container: ServiceContainer) {
        this.container = container;
    }
}