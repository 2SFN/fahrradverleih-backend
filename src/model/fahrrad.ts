import FahrradTyp from "./fahrradtyp";
import GeopositionT from "./geoposition";
import Station from "./station";
import TarifT from "./tarif";

export default class Fahrrad {
    constructor(
        private id: string,
        private position: GeopositionT,
        private typ: FahrradTyp,
        private station: Station | null) { }

    toString() {
        return `${this.typ.toString()} @ ${this.position.toString()}`;
    }
}