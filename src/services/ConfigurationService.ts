import * as yaml from 'js-yaml';
import Service, { ServiceContainer } from "./Service";
import { readFileSync } from 'fs';

/**
 * Classe gérant le service de configuration.
 */
export default class ConfigurationService extends Service {

    public readonly databases: {
        mongodb: {
            host: string;
            port: number;
            user: string;
            password: string;
        }
    };

    /**
     * Construit un nouveau service de configuration.
     * 
     * @param container Conteneur de services
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.databases = this.load('config/databases.yml');
    }

    /**
     * Charge un fichier (YAML uniquement).
     * 
     * @param path Chemin diu fichier à charger
     * @returns Fichier chargé
     */
    public load(path: string): any {
        return yaml.safeLoad(readFileSync(path, 'UTF-8'));
    }
}