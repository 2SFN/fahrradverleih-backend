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
        private betrag: number = 0,
        private iso4217: string = "EUR") { }

    toString() {
        return `${this.iso4217} ${this.betrag}`;
    }
}