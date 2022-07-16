export default class CurrencyT {

    /**
         * ISO 4217 definiert Kürzel und numerische Codes für verschiedene
         * internationale Währungen.
         * 
         * Hier wird als Standard Euro (EUR) vorgesehen.
         * 
         * @see https://en.wikipedia.org/wiki/ISO_4217
         */
    constructor(
        public betrag: number = 0,
        public iso4217: string = "EUR") { }

    toString() {
        return `${this.iso4217} ${this.betrag}`;
    }

    asObject() {
        return {
            betrag: this.betrag,
            iso4217: this.iso4217
        };
    }
}