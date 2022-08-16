import express, {NextFunction, Request, Response} from "express";
import DataStore from "./util/data-store";
import Benutzer from "./model/benutzer";
import Ausleihe from "./model/ausleihe";

// DataStore Instanz
const data: DataStore = new DataStore();

// Stark vereinfachte Benutzerverwaltung und Authentifizierung:
// Map, die einem generierten Token eine Benutzer-Instanz zuweist.
// Außerdem wird ein Token hardcoded vorgesehen, um im REST-Client
// auch über Serverinstanzen hinweg reproduzierbare Ergebnisse
// erzeugen zu können.
const sessions: Map<string, Benutzer> = new Map();

{
    const u3: Benutzer | null = data.getBenutzerNachId("U0003");
    if (u3 !== null) sessions.set("U0003-Test", u3);
}

const benutzerAuth = (r: Request): Benutzer | null => {
    return sessions.get(String(r.headers.token)) || null;
}

// Minimale express-middleware, welche den Benutzer authentifiziert und
// den Request-Context entsprechend aktualisiert
interface AuthorizedRequest extends Request {
    benutzer?: Benutzer;
}

const authRoute = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const u = benutzerAuth(req);
    if (u === null) respond401(res);
    else {
        req.benutzer = u;
        next();
    }
}

// Standard-Antworten bei Fehlern
const respond400 = (r: Response, message: string = "Falsche Parameter.") => {
    r.status(400).json({error: message});
}

const respond401 = (r: Response, message: string = "Nicht autorisiert.") => {
    r.status(401).json({error: message});
}

const router = express.Router()
export default router;

///////////////  API: /benutzer  ///////////////

router.post("/benutzer/login", async (req: Request, res: Response) => {
    if ((req.body.email === undefined || req.body.secret === undefined)) {
        respond400(res);
        return;
    }

    const u = data.authentifiziereBenutzer(
        String(req.body.email), String(req.body.secret));

    if (u === null) {
        respond401(res, "Falsche Zugangsdaten.");
    } else {
        // Für Testzwecke ausreichend: Token wird basierend auf
        // aktueller Microtime und Nutzer-ID erzeugt
        const token = `T-${u.id}-${new Date().getTime()}`;
        sessions.set(token, u);
        res.status(200).json({ok: true, token: token});
    }
});

router.get("/benutzer/auth", authRoute, async (req: AuthorizedRequest, res: Response) => {
    res.status(200).json({ok: true});
});

router.get("/benutzer/details", authRoute, async (req: AuthorizedRequest, res: Response) => {
    res.status(200).json(req.benutzer?.asObject());
});

router.post("/benutzer/details", authRoute, async (req: AuthorizedRequest, res: Response) => {
    if (req.benutzer === undefined) return;
    if (req.body.vorname) req.benutzer.vorname = req.body.vorname;
    if (req.body.name) req.benutzer.name = req.body.name;
    if (req.body.email) req.benutzer.email = req.body.email;
    res.status(200).json({"ok": true});
});

///////////////  API: /benutzer/ausleihen  ///////////////

router.get("/benutzer/ausleihen", authRoute, async (req: AuthorizedRequest, res: Response) => {
    let liste = []
    for (const a of req.benutzer?.ausleihen || []) liste.push(a.asObject());
    liste = liste.sort((a, b) => b.bis.getTime() - a.bis.getTime());
    res.status(200).json(liste);
});

router.post("/benutzer/ausleihen/neu", authRoute, async (req: AuthorizedRequest, res: Response) => {
    if (!req.body.fahrrad.id || !req.body.von || !req.body.bis || !req.benutzer) {
        respond400(res);
        return;
    }

    const rad = data.getRadNachId(req.body.fahrrad.id);
    const valVon = Date.parse(req.body.von);
    const valBis = Date.parse(req.body.bis);

    if (rad === null || isNaN(valVon) || isNaN(valBis) || valBis < valVon || rad.station === null) {
        respond400(res);
    } else {
        const ausleihe = new Ausleihe(`A-${req.benutzer.id}-${new Date().getTime()}`,
            rad, req.benutzer, new Date(valVon), new Date(valBis), rad.typ.tarif);

        rad.station.removeRad(rad);
        req.benutzer.ausleihen.push(ausleihe);

        res.status(200).json(ausleihe.asObject());
    }
});

router.post("/benutzer/ausleihen/ende", authRoute, async (req: AuthorizedRequest, res: Response) => {
    if (!req.body.ausleihe.id || !req.body.station.id || req.benutzer === undefined) {
        respond400(res);
        return;
    }

    const ausleihe = req.benutzer.getAusleiheNachId(req.body.ausleihe.id);
    const station = data.getStationNachId(req.body.station.id);

    if (ausleihe === null || station === null) {
        respond400(res, "Ungültige Parameter (Station/Ausleihe).");
    } else if (ausleihe.fahrrad.station !== null) {
        respond400(res, "Fahrrad bereits zurückgegeben.");
    } else {
        if(ausleihe.bis.getTime() > new Date().getTime()) ausleihe.bis = new Date();
        station.addRad(ausleihe.fahrrad);
        res.status(200).json(ausleihe.asObject());
    }
});

///////////////  API: /stationen  ///////////////

router.get("/stationen", async (req: Request, res: Response) => {
    const liste = []
    for (const s of data.getStationen()) liste.push(s.asObject());
    res.status(200).json(liste);
});

router.get("/stationen/:id/raeder", async (req: Request, res: Response) => {
    if (req.params.id === undefined) {
        respond400(res);
        return;
    }

    const station = data.getStationNachId(req.params.id);
    if (station === null) {
        respond400(res, "Ungültiger Parameter: Station.");
        return;
    }

    const liste = []
    for (const f of station.fahrraeder) liste.push(f.asObject());
    res.status(200).json(liste);
});
