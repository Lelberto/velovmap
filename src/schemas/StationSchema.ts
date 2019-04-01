import Schema from "./Schema";

/**
 * Interface du schéma des stations Vélo'v.
 */
export default interface StationSchema extends Schema {
    type: string;
    properties: {
        number: number;
        name: string;
        address: string;
        address2: string;
        commune: string;
        nmarrond: number;
        bonus: string;
        pole: string;
        lat: number;
        lng: number;
        bike_stands: number;
        status: string;
        available_bike_stands: number;
        available_bikes: number;
        availabilitycode: number;
        availability: string;
        banking: number;
        gid: number;
        last_update: Date;
        last_update_fme: Date;
        langue: string;
        etat: string;
        nature: string;
        titre: string;
        description: string;
    }
}