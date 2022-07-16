import Benutzer from "./benutzer";
import Fahrrad from "./fahrrad";
import TarifT from "./tarif";

export default class Ausleihe {
    constructor(
        public id: string = Ausleihe.genDefaultId(),
        public fahrrad: Fahrrad,
        public benutzer: Benutzer,
        public von: Date,
        public bis: Date,
        public tarif: TarifT) { }

    toString() {
        return `Ausleihe von Benutzer ${this.benutzer.toString()}`;
    }

    asObject() {
        return {
            id: this.id,
            fahrrad: this.fahrrad.asObject(),
            tarif: this.tarif,
            von: this.von,
            bis: this.bis
        };
    }

    private static genDefaultId() {
        // Für Testzwecke ausreichend:
        // Generiert eine ID basierend auf der aktuellen Microtime
        return `A-${new Date().getTime()}`;
    }
}