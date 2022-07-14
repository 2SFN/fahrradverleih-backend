import Ausleihe from "./ausleihe"

export default class Benutzer {
    private ausleihen: Ausleihe[] = [];

    constructor(
        private id: string,
        private name: string,
        private vorname: string,
        private email: string,
        private secret: string) { }

    toString() {
        return `${this.email} [${this.id}]`
    }
}