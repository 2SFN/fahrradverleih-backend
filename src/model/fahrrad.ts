import FahrradTyp from "./fahrradtyp";
import GeopositionT from "./geoposition";
import Station from "./station";
import TarifT from "./tarif";

export default class Fahrrad {
    constructor(
        public id: string,
        public position: GeopositionT,
        public typ: FahrradTyp,
        public station: Station | null) { }

    toString() {
        return `${this.typ.toString()} @ ${this.position.toString()}`;
    }
    
    asObject() {
        return {
            id: this.id,
            position: this.position.asObject(),
            typ: this.typ.asObject()
        }
    }
}