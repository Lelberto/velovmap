import Service, { ServiceContainer } from "./Service";
import * as request from 'request-promise';
import DistrictSchema from "../schemas/DistrictSchema";
import { Collection } from "mongodb";
import Schema from "../schemas/Schema";
import StationSchema from "../schemas/StationSchema";

export default class DataRetrieveService extends Service {

    public constructor(container: ServiceContainer) {
        super(container);
    }

    public async getData(dataType: 'districts' | 'stations'): Promise<any> {
        switch (dataType) {
            case "districts": return await request('https://download.data.grandlyon.com/wfs/grandlyon?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&maxfeatures=10000&request=GetFeature&typename=adr_voie_lieu.adrquartier&SRSNAME=urn:ogc:def:crs:EPSG::4171');
            case "stations": return await request('https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&maxfeatures=10000&request=GetFeature&typename=jcd_jcdecaux.jcdvelov&SRSNAME=urn:ogc:def:crs:EPSG::4171');
            default: throw new Error('Unknow data type');
        }
    }

    public updateData(interval: number) {
        setInterval(this.updateInterval, interval);
        this.updateInterval();
    }

    private updateInterval(): void {
        // Mise à jour des quartiers
        this.getData('districts').then((data) => {
            data = JSON.parse(data); // transformation en JSON
            const coll: Collection<DistrictSchema> = this.container.mongodb.getCollection<DistrictSchema>('districts');

            coll.deleteMany({}).then(() => {
                coll.insertMany(data.features).then((result) => {
                    console.log(`Updated collection "districts" (${result.result.n} inserted)`);
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error);

        // Mise à jour des stations Vélo'v
        this.getData('stations').then((data) => {
            data = JSON.parse(data); // transformation en JSON
            const coll: Collection<StationSchema> = this.container.mongodb.getCollection<StationSchema>('stations');

            coll.deleteMany({}).then(() => {
                coll.insertMany(data.features).then((result) => {
                    console.log(`Updated collection "stations" (${result.result.n} inserted)`);
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error);
    }
}