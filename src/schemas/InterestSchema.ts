import Schema from "./Schema";

/**
 * Interface du schéma des points d'intérêt touristiques.
 */
export default interface InterestSchema extends Schema {
    type: string;
    properties: {
        id: string;
        id_sitra1: string;
        type: string;
        type_detail: string;
        nom: string;
        adresse: string;
        codepostal: string;
        commune: string;
        telephone: string;
        fax: string;
        email: string;
        siteweb: string;
        facebook: string;
        classement: string;
        ouverture: string;
        tarifsenclair: string;
        tarifsmin: string;
        tarifsmax: string;
        producteur: string;
        gid: string;
        date_creation: Date;
        last_update: Date;
        last_update_fme: Date;
    },
    geometry: {
        type: string;
        coordinates: number[]
    }
}