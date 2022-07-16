import CurrencyT from "./currency";

export default class TarifT {
    constructor(
        public preis: CurrencyT = new CurrencyT(),
        public taktung: number = 0) { }

    toString(){
        return `${this.preis.toString()} pro ${this.taktung} Stunde(n).`;
    }

    asObject() {
        return {
            preis: this.preis.asObject(),
            taktung: this.taktung
        };
    }
}