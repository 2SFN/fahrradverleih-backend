import Ausleihe from "./ausleihe"

export default class Benutzer {
    public ausleihen: Ausleihe[] = [];

    constructor(
        public id: string,
        public name: string,
        public vorname: string,
        public email: string,
        public secret: string) { }

    toString() {
        return `${this.email} [${this.id}]`
    }
}