export default class GeopositionT {
    constructor(
        public breite: number = 0.0,
        public laenge: number = 0.0) { }

    toString() {
        return `(${this.breite},${this.laenge})`;
    }

    asObject() {
        return {
            breite: this.breite,
            laenge: this.laenge
        }
    }
}