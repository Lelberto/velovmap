import Service, { ServiceContainer } from "./Service";
import * as request from 'request-promise';

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

    public updateDataInterval(interval: number) {
        setInterval(() => {
            this.getData('districts').then((data) => {
                console.log(data);
            }).catch(console.error);
        }, interval);
    }
}