import express, {Request, Response} from "express";
import DataStore from "./util/data-store";
import Benutzer from "./model/benutzer";

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

// Standard-Antworten bei Fehlern
const respond400 = (r: Response) => {
    r.status(400).json({error: "Falsche Parameter."})
}
const respond401 = (r: Response) => {
    r.status(401).json({error: "Nicht autorisiert."})
}

///////////////  API  ///////////////
const router = express.Router()
export default router;

router.post("/benutzer/auth", async (req: Request, res: Response) => {
    // Modus A: Token prüfen, keine neue Session erstellen
    if (req.headers.token !== undefined) {
        const u = benutzerAuth(req);
        if (u === null) {
            respond401(res);
        } else {
            res.status(200).json({ok: true, token: req.headers.token});
        }
        return;
    }

    // Modus B: Neue Session
    if ((req.body.email === undefined || req.body.secret === undefined)) {
        respond400(res);
        return;
    }

    const u = data.authentifiziereBenutzer(
        String(req.body.email), String(req.body.secret));

    if (u === null) {
        respond401(res);
    } else {
        // Für Testzwecke ausreichend: Token wird basierend auf
        // aktueller Microtime und Nutzer-ID erzeugt
        const token = `T-${u.id}-${new Date().getTime()}`;
        sessions.set(token, u);
        res.status(200).json({
            ok: true, token: token
        });
    }
});

router.get("/benutzer/details", async (req: Request, res: Response) => {
    const u = benutzerAuth(req);
    if (u === null) {
        respond401(res);
    } else {
        res.status(200).json(u.asObject());
    }
});

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
        respond400(res);
        return;
    }

    const liste = []
    for (const f of station.fahrraeder) liste.push(f.asObject());
    res.status(200).json(liste);
});

router.get("/benutzer/ausleihen", async (req: Request, res: Response) => {
    const u = benutzerAuth(req);
    if (u === null) {
        respond401(res);
    } else {
        const liste = []
        for (const a of u.ausleihen) liste.push(a.asObject());
        res.status(200).json(liste);
    }
});
