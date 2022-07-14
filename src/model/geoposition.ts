export default class GeopositionT {
    constructor(
        private breite: number = 0.0,
        private laenge: number = 0.0) { }

    toString() {
        return `(${this.breite},${this.laenge})`;
    }
}