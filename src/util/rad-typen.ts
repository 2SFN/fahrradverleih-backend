import CurrencyT from "../model/currency";
import FahrradTyp from "../model/fahrradtyp";
import TarifT from "../model/tarif";

/**
 * Klasse mit Definitionen für in diesem Projekt verwendete
 * Rad-Typen.
 * 
 * @see FahrradTyp
 */
export default class RadTypen {
    static readonly CITY_BIKE = new FahrradTyp("City-Bike", new TarifT(new CurrencyT(3), 3));
    static readonly JUGENDRAD = new FahrradTyp("Jugendrad", new TarifT(new CurrencyT(4), 3));
    static readonly LASTENRAD = new FahrradTyp("Lastenrad", new TarifT(new CurrencyT(5), 3));
    static readonly E_BIKE = new FahrradTyp("E-Bike", new TarifT(new CurrencyT(7), 3));
}