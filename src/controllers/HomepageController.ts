import Controller, { Method } from "./Controller";
import { ServiceContainer } from "../services/Service";
import { Request, Response } from "express";

export default class HomepageController extends Controller {

    public constructor(container: ServiceContainer) {
        super(container, '/');

        this.getIndex = this.getIndex.bind(this);

        this.bindRoute(Method.GET, '/', this.getIndex);
    }

    private getIndex(req: Request, res: Response): any {
        this.container.mongodb.getCollection('stations').find({}).toArray().then((stations) => {
            return res.render('homepage/index.html.twig', {
                stations
            });
        });
    }
}