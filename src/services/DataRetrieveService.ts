import Service, { ServiceContainer } from "./Service";
import * as request from 'request-promise';
import * as mysql from 'mysql2';
import DistrictSchema from "../schemas/DistrictSchema";
import { Collection } from "mongodb";
import StationSchema from "../schemas/StationSchema";
import InterestSchema from "../schemas/InterestSchema";

/**
 * Classe gérant le service de récupération des données depuis l'OpenData du Grand Lyon.
 */
export default class DataRetrieveService extends Service {

    /**
     * Construit un nouveau service de récupération des données depuis l'OpenData du Grand Lyon.
     * 
     * @param container Conteneur de services
     */
    public constructor(container: ServiceContainer) {
        super(container);

        this.updateData = this.updateData.bind(this);
    }

    /**
     * Retourne les données souhaitées depuis l'OpenData.
     * 
     * @param dataType Type des données à récupérer
     * @async
     */
    public async getData(dataType: 'districts' | 'stations' | 'interests'): Promise<any> {
        switch (dataType) {
            case "districts": return await request('https://download.data.grandlyon.com/wfs/grandlyon?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&maxfeatures=10000&request=GetFeature&typename=adr_voie_lieu.adrquartier&SRSNAME=urn:ogc:def:crs:EPSG::4171');
            case "stations": return await request('https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&maxfeatures=10000&request=GetFeature&typename=jcd_jcdecaux.jcdvelov&SRSNAME=urn:ogc:def:crs:EPSG::4171');
            case "interests": return await request('https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&maxfeatures=10000&request=GetFeature&typename=sit_sitra.sittourisme&SRSNAME=urn:ogc:def:crs:EPSG::4171');
            default: throw new Error('Unknow data type');
        }
    }

    /**
     * Met à jour les données dans les bases de données à un intervalle régulier.
     * 
     * @param interval Intervalle de récupération des données (en millisecondes)
     */
    public updateInterval(interval: number) {
        setInterval(this.updateData, interval);
        this.updateData();
    }

    /**
     * Récupère et insert les données dans les bases de données.
     */
    private updateData(): void {
        // Mise à jour des quartiers
        this.getData('districts').then((data) => {
            data = JSON.parse(data); // transformation en JSON
            const coll: Collection<DistrictSchema> = this.container.mongodb.getCollection<DistrictSchema>('districts');

            coll.deleteMany({}).then(() => {
                coll.insertMany(data.features).then((result) => {
                    console.log(`Updated collection "districts" (${result.result.n} inserted)`);
                }).catch(console.error);
            }).catch(console.error);

            // Création du script MySQL
            this.container.mysql.query('TRUNCATE TABLE districts');

            let sqlQuery = `INSERT INTO districts VALUES `;
            for (const feature of data.features) {
                sqlQuery += `(DEFAULT, '${feature.properties.nom}', '${feature.properties.theme}', '${feature.properties.soustheme}', '${feature.properties.siret}', '${feature.properties.datecreation}'), `;
            }
            this.container.mysql.query(sqlQuery).then(() => {
                console.log('(fake) Updated table "districts"');
            });
        }).catch(console.error);

        // Mise à jour des stations Vélo'v
        this.getData('stations').then((data) => {
            data = JSON.parse(data); // transformation en JSON
            const coll: Collection<StationSchema> = this.container.mongodb.getCollection<StationSchema>('stations');

            coll.deleteMany({}).then(() => {
                coll.insertMany(data.features).then((result) => {
                    coll.createIndex({ geometry: '2dsphere' });
                    console.log(`Updated collection "stations" (${result.result.n} inserted)`);
                }).catch(console.error);
            }).catch(console.error);

            // Création du script MySQL
            this.container.mysql.query('TRUNCATE TABLE stations');
            
            let sqlQuery = `INSERT INTO stations VALUES `;
            for (const feature of data.features) {
                sqlQuery += `(DEFAULT, ${feature.properties.number}, '${feature.properties.name}', '${feature.properties.address}', '${feature.properties.address2}', ${feature.properties.nmarrond}, '${feature.properties.bonus}', '${feature.properties.pole}', ${feature.properties.lat}, ${feature.properties.lng}, ${feature.properties.bike_stands}, '${feature.properties.status}', ${feature.properties.available_bike_stands}, ${feature.properties.available_bikes}, ${feature.properties.availabilitycode}, '${feature.properties.availability}', ${feature.properties.banking}, ${feature.properties.gid}, '${feature.properties.last_update}', '${feature.properties.last_update_fme}', '${feature.properties.code_insee}', '${feature.properties.langue}', '${feature.properties.etat}', '${feature.properties.nature}', '${feature.properties.type}', '${feature.properties.description}'), `;
            }
            this.container.mysql.query(sqlQuery).then(() => {
                console.log('(fake) Updated table "stations"');
            });
        }).catch(console.error);

        // Mise à jour des points d'intérêt touristiques
        this.getData('interests').then((data) => {
            data = JSON.parse(data); // transformation en JSON
            const coll: Collection<InterestSchema> = this.container.mongodb.getCollection<InterestSchema>('interests');

            coll.deleteMany({}).then(() => {
                coll.insertMany(data.features).then((result) => {
                    coll.createIndex({ geometry: '2dsphere' });
                    console.log(`Updated collection "interests" (${result.result.n} inserted)`);
                }).catch(console.error);
            }).catch(console.error);

            // Création du script MySQL
            this.container.mysql.query('TRUNCATE TABLE interests');
            
            let sqlQuery = `INSERT INTO interests VALUES `;
            for (const feature of data.features) {
                sqlQuery += `(DEFAULT, '${feature.properties.id_sitra1}', '${feature.properties.type}', '${feature.properties.type_detail}', '${feature.properties.nom}', ${feature.properties.adresse}, ${feature.properties.codepostal}, '${feature.properties.telephone}', '${feature.properties.fax}', '${feature.properties.telephonefax}', '${feature.properties.email}', '${feature.properties.siteweb}', '${feature.properties.facebook}', '${feature.properties.classement}', '${feature.properties.ouvertude}', '${feature.properties.tarifsenclair}', ${feature.properties.tarifsmin}, '${feature.properties.tarifsmax}', '${feature.properties.producteur}', '${feature.properties.gid}', '${feature.properties.date_creation}', '${feature.properties.last_update}', '${feature.properties.last_update_fme}'), `;
            }
            this.container.mysql.query(sqlQuery).then(() => {
                console.log('(fake) Updated table "interests"');
            });
        }).catch(console.error);
    }
}