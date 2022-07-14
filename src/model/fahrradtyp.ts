import TarifT from "./tarif";

export default class FahrradTyp {
    constructor(
        private bezeichnung: string = "",
        private tarif: TarifT) {}

    toString() {
        return `${this.bezeichnung} (${this.tarif.toString()})`;
    }
}