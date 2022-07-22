import Ausleihe from "../model/ausleihe";
import Benutzer from "../model/benutzer";
import Fahrrad from "../model/fahrrad";
import GeopositionT from "../model/geoposition";
import Station from "../model/station";
import RadTypen from "./rad-typen";

/**
 * Einfache Container-Klasse, die Listen von relevanten Objekten und
 * einige Funktionen enthält, um als Datenquelle zu dienen.
 * 
 * Secrets werden hier für Testzwecke zugunsten der Übersichtlichkeit
 * nicht kryptografisch verarbeitet.
 */
export default class DataStore {
    // Felder für Daten
    private benutzer: Benutzer[] = [];
    private stationen: Station[] = [];
    private raeder: Fahrrad[] = [];

    /**
     * Erstellt eine neue Instanz und füllt die Listen mit einigen
     * Beispieldaten.
     */
    constructor() {
        this.benutzer.push(new Benutzer("U0001", "Gerle", "Martina", "u1@test.mail", "Test"));
        this.benutzer.push(new Benutzer("U0002", "Neumann", "Frank", "u2@test.mail", "Test"));
        this.benutzer.push(new Benutzer("U0003", "Regenberg", "Skylar", "u3@test.mail", "Test"));

        // Die Geokoordinaten sollten in etwa zu den Straßennamen passen (Monheim am Rhein)
        this.stationen.push(new Station("S0001", "Berghauser Straße", new GeopositionT(51.114696, 6.893327)));
        this.stationen.push(new Station("S0002", "Lichtenberger Straße", new GeopositionT(51.083633, 6.893604)));

        this.raeder.push(new Fahrrad("R0001", new GeopositionT(), RadTypen.CITY_BIKE, this.stationen[0]));
        this.raeder.push(new Fahrrad("R0002", new GeopositionT(), RadTypen.E_BIKE, this.stationen[0]));
        this.raeder.push(new Fahrrad("R0003", new GeopositionT(), RadTypen.JUGENDRAD, this.stationen[0]));
        this.raeder.forEach(r => this.stationen[0].fahrraeder.push(r));

        // Einen Anwender mit Daten vorbereiten
        const u = this.benutzer[2];
        u.ausleihen.push(new Ausleihe("A-test1", this.raeder[0], u,
            new Date("Sat Jul 16 2022 07:00:00 GMT+0200 (Central European Summer Time)"),
            new Date("Sat Jul 16 2022 10:00:00 GMT+0200 (Central European Summer Time)"),
            this.raeder[0].typ.tarif));
        u.ausleihen.push(new Ausleihe("A-test1", this.raeder[2], u,
            new Date("Sat Jul 16 2022 11:00:00 GMT+0200 (Central European Summer Time)"),
            new Date("Sat Jul 16 2022 14:00:00 GMT+0200 (Central European Summer Time)"),
            this.raeder[2].typ.tarif));
    }

    /**
     * Sehr simpler Mechanismus, um Benutzer anhand der E-Mail Adresse und des
     * Secrets zu finden/authentifizieren.
     * 
     * Die Sessions selbst werden hier nicht verwaltet.
     * 
     * @param email E-Mail Adresse des Benutzers.
     * @param secret Secret des Benutzers. Wird hier direkt verglichen.
     * @returns 
     */
    public authentifiziereBenutzer(email: string, secret: string): Benutzer | null {
        for(const c of this.benutzer) {
            if(email === c.email && secret === c.secret) {
                return c;
            }
        }

        return null;
    }

    /**
     * Finde eine Station basierend auf der ID.
     * 
     * @param stationId ID der zu findenden Station.
     * @returns Stationen-Instanz, oder null, falls die Station nicht existiert.
     */
    public getStationNachId(stationId: string): Station | null {
        return this.stationen.find(s => s.id === stationId) || null;
    }

    public getStationen() { return this.stationen };

    /**
     * Finde ein Fahrrad basierend auf dessen ID.
     * 
     * @param radId ID des zu findenden Fahrrads.
     * @returns Fahrrad-Instanz, oder null, falls das Fahrrad nicht existiert.
     */
    public getRadNachId(radId: string): Fahrrad | null {
        return this.raeder.find(f => f.id === radId) || null;
    }

    public getBenutzerNachId(benutzerId: string): Benutzer | null {
        return this.benutzer.find(u => u.id === benutzerId) || null;
    }

}