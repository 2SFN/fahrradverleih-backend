import Fahrrad from "./fahrrad";
import GeopositionT from "./geoposition";

export default class Station {
    private fahrraeder: Fahrrad[] = [];
    constructor(
        private id: string = "",
        private bezeichnung: string = "",
        private position: GeopositionT = new GeopositionT()) { }
}