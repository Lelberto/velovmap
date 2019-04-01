import { Router, RequestHandler, NextFunction, Request, Response } from 'express';
import { ServiceContainer } from "../services/Service";

/**
 * Classe gérant les contrôleurs.
 */
export default abstract class Controller {

    protected readonly container: ServiceContainer;
    public readonly rootPath: string;
    public readonly router: Router;
    
    /**
     * Construit un nouveau contrôleur.
     * 
     * @param container Conteneur de services
     * @param rootPath Chemin racine
     */
    public constructor(container: ServiceContainer, rootPath: string) {
        this.container = container;
        this.rootPath = rootPath;
        this.router = Router();
    }

    /**
     * Lie une route au routeur Express du contrôleur.
     * 
     * @param method Méthode HTTP
     * @param path Chemin
     * @param handlers Handlers appelés à la suite
     */
    protected bindRoute(method: Method, path: string, ...handlers: RequestHandler[]) {
        function requestInfos(req: Request, res: Response, next: NextFunction): any {
            console.log(`Triggered ${method.toUpperCase()} ${path}`);
            return next();
        }

        this.router[method](path, requestInfos, handlers);
    }
}



/**
 * Interface regroupant les différentes méthodes HTTP.
 */
export enum Method {
    GET = 'get',
    POST = 'post'
}