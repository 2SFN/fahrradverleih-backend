import TarifT from "./tarif";

export default class FahrradTyp {
    constructor(
        public bezeichnung: string = "",
        public tarif: TarifT) {}

    toString() {
        return `${this.bezeichnung} (${this.tarif.toString()})`;
    }

    asObject() {
        return {
            bezeichnung: this.bezeichnung,
            tarif: this.tarif
        };
    }
}