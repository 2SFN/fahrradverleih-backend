import Benutzer from "./benutzer";
import Fahrrad from "./fahrrad";
import TarifT from "./tarif";

export default class Ausleihe {
    constructor(
        private fahrrad: Fahrrad,
        private benutzer: Benutzer,
        private von: Date,
        private bis: Date,
        private tarif: TarifT) { }

    toString() {
        return `Ausleihe von Benutzer ${this.benutzer.toString()}`;
    }
}