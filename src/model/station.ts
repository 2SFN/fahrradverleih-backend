import Fahrrad from "./fahrrad";
import GeopositionT from "./geoposition";

export default class Station {
    public fahrraeder: Fahrrad[] = [];

    constructor(
        public id: string = "",
        public bezeichnung: string = "",
        public position: GeopositionT = new GeopositionT()) { }

    /**
     * Zählt die Anzahl der verfügbaren (anh. d. Bez.) Fahrräder pro Typ.
     * 
     * @returns Objekt mit Key-Value Zuordnung (`typ: anzahl`).
     */
    raederProTyp(): object {
        const map: Map<string, number> = new Map();

        for (const r of this.fahrraeder) {
            const key = r.typ.bezeichnung;
            map.set(key, (map.get(key) || 0) + 1)
        }

        return Object.fromEntries(map);
    }

    asObject() {
        return {
            id: this.id,
            bezeichnung: this.bezeichnung,
            position: this.position.asObject(),
            verfuegbar: this.fahrraeder.length
        };
    }

    public removeRad(rad: Fahrrad) {
        this.fahrraeder.forEach((r, i) => {
            if (r.id === rad.id) {
                this.fahrraeder.splice(i, 1);
                r.station = null;
            }
        });
    }

    public addRad(rad: Fahrrad) {
        this.fahrraeder.push(rad);
        rad.station = this;
    }

}