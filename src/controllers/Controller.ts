import { Router, RequestHandler, NextFunction, Request, Response } from 'express';
import { ServiceContainer } from "../services/Service";

export default abstract class Controller {

    protected readonly container: ServiceContainer;
    public readonly rootPath: string;
    public readonly router: Router;
    
    public constructor(container: ServiceContainer, rootPath: string) {
        this.container = container;
        this.rootPath = rootPath;
        this.router = Router();
    }

    protected bindRoute(method: Method, path: string, ...handlers: RequestHandler[]) {
        function requestInfos(req: Request, res: Response, next: NextFunction): any {
            console.log(`Triggered ${method.toUpperCase()} ${path}`);
            return next();
        }

        this.router[method](path, requestInfos, handlers);
    }
}

export enum Method {
    GET = 'get',
    POST = 'post'
}