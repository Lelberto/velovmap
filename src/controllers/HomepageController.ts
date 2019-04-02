import Controller, { Method } from "./Controller";
import { ServiceContainer } from "../services/Service";
import { Request, Response } from "express";

/**
 * Classe gérant le contrôleur de la page d'accueil.
 */
export default class HomepageController extends Controller {

    /**
     * Construit un nouveau contrôleur de la page d'accueil.
     * 
     * @param container Conteneur de services
     */
    public constructor(container: ServiceContainer) {
        super(container, '/');

        this.getIndex = this.getIndex.bind(this);

        this.bindRoute(Method.GET, '/', this.getIndex);
    }

    /**
     * Handler de l'index de la page d'accueil.
     * 
     * - Méthode : GET
     * - Chemin : /
     * 
     * @param req Requête Express
     * @param res Réponse Express
     */
    private getIndex(req: Request, res: Response): any {
        this.container.mongodb.getCollection('stations').find({
            'properties.status': { $ne: 'CLOSED' },
            'properties.available_bikes': { $gt: 0 }
        }).toArray().then((stations) => {
            this.container.mongodb.getCollection('districts').find({}).toArray().then((districts) => {
                this.container.mongodb.getCollection('interests').find({}).toArray().then((interests) => {
                    return res.render('homepage/index.html.twig', {
                        stations, districts, interests
                    });
                });
            });
        });
    }
}