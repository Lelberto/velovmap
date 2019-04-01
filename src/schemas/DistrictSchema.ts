import Schema from "./Schema";

/**
 * Interface du schéma des quartiers de Lyon.
 */
export default interface DistrictSchema extends Schema {
    type: string;
    properties: {
        nom: string;
        theme: string;
        soustheme: string;
        identifiant: string;
        idexterne: string;
        siret: string;
        datecreation: Date;
        gid: string;
    }
}