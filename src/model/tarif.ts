import CurrencyT from "./currency";

export default class TarifT {
    constructor(
        private preis: CurrencyT = new CurrencyT(),
        private taktung: number = 0) { }

    toString(){
        return `${this.preis.toString()} pro ${this.taktung} Stunde(n).`;
    }
}