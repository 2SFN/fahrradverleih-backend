/*
2022-07 Fahrradverleih-Backend

Einfaches Backend, das eine RESTful API für den Fahrradverleih zur
Verfügung stellt. Daten werden nicht persistiert und es sind keine
Sicherheits-Features implementiert.

Standardmäßiger Port für den WebServer: 3000
*/
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';

import Benutzer from './model/benutzer';
import Station from './model/station';
import DataStore from './util/data-store';
import {CorsOptions} from "cors";

///////////////  Express & Umgebung  ///////////////
const server = express();
server.use(express.json());

// Konfiguration für CORS in der Ionic-Entwicklungsumgebung
// s. https://ionicframework.com/docs/troubleshooting/cors
const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
];

const corsOptions: CorsOptions = {
    origin: allowedOrigins
}

server.use(cors(corsOptions));

const {
    PORT = 3000,
} = process.env;

// DataStore Instanz
const data: DataStore = new DataStore();

// Stark vereinfachte Benutzerverwaltung und Authentifizierung:
// Map, die einem generierten Token eine Benutzer-Instanz zuweist.
// Außerdem wird ein Token hardcoded vorgesehen, um im REST-Client
// auch über Serverinstanzen hinweg reproduzierbare Ergebnisse
// erzeugen zu können. 
const sessions: Map<string, Benutzer> = new Map();
{const u3: Benutzer | null = data.getBenutzerNachId("U0003");
if(u3 !== null) sessions.set("U0003-Test", u3);}

const benutzerAuth = (r: Request): Benutzer | null => {
    return sessions.get(String(r.headers.token)) || null; }

///////////////  API  ///////////////

server.listen(PORT, () => {
    console.log(`Server listenening on port ${PORT}!`);
});

// Standard-Antworten bei Fehlern
const respond400 = (r: Response) => { r.status(400).json({error: "Falsche Parameter."}) }
const respond401 = (r: Response) => { r.status(401).json({error: "Nicht autorisiert."}) }

server.post("/benutzer/auth", async (req: Request, res: Response) => {
    // Modus A: Token prüfen, keine neue Session erstellen
    if(req.headers.token !== undefined) {
        const u = benutzerAuth(req);
        if(u === null) {
            respond401(res);
        } else {
            res.status(200).json({ok: true, token: req.headers.token});
        }
        return;
    }

    // Modus B: Neue Session
    if((req.body.email === undefined || req.body.secret === undefined)) {
        respond400(res);
        return;
    }
    
    const u = data.authentifiziereBenutzer(
        String(req.body.email), String(req.body.secret));
    
    if(u === null) {
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

server.get("/benutzer/details", async (req: Request, res: Response) => {
    const u = benutzerAuth(req);
    if(u === null) {
        respond401(res);
    } else {
        res.status(200).json(u.asObject());
    }
});

server.get("/stationen", async (req: Request, res: Response) => {
    const liste = []
    for (const s of data.getStationen()) liste.push(s.asObject());
    res.status(200).json(liste);
});

server.get("/stationen/:id/raeder", async (req: Request, res: Response) => {
    if(req.params.id === undefined) {
        respond400(res);
        return;
    }

    const station = data.getStationNachId(req.params.id);
    if(station === null) {
        respond400(res);
        return;
    }

    const liste = []
    for (const f of station.fahrraeder) liste.push(f.asObject());
    res.status(200).json(liste);
});

server.get("/benutzer/ausleihen", async (req: Request, res: Response) => {
    const u = benutzerAuth(req);
    if(u === null) {
        respond401(res);
    } else {
        const liste = []
        for (const a of u.ausleihen) liste.push(a.asObject());
        res.status(200).json(liste);
    }
});
