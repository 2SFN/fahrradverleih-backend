/*
2022-07 Fahrradverleih-Backend

Einfaches Backend, das eine RESTful API für den Fahrradverleih zur
Verfügung stellt. Daten werden nicht persistiert und es sind keine
Sicherheits-Features implementiert.

Standardmäßiger Port für den WebServer: 3000/3443 (s. .env.example)
*/
import express from 'express';
import cors from 'cors';
import {CorsOptions} from "cors";
import router from "./api";
import * as https from "https";

///////////////  Express & Umgebung  ///////////////
const app = express();
app.use(express.json());

// Konfiguration für CORS innerhalb der Ionic-Entwicklungsumgebung
// s. https://ionicframework.com/docs/troubleshooting/cors
const allowedOrigins: string[] = [];
(process.env.CORS_ALLOWED_ORIGINS || "").split(';').forEach(o => allowedOrigins.push(o));

const corsOptions: CorsOptions = {
    origin: allowedOrigins
}

app.use(cors(corsOptions));

// Auf Port hören
const {PORT = 3000} = process.env;

app.listen(PORT, () => {
    console.log(`Server listening (HTTP) Port: ${PORT}`);
});

// API-Endpunkte (router) einbinden
app.use('/api', router);

// Optional: API auch mit SSL-Unterstützung zur Verfügung stellen
if (process.env.ENABLE_SSL === "yes") {
    const secureServer = https.createServer({
        key: process.env.SSL_KEY,
        cert: process.env.SSL_CRT
    }, app);
    const {SSL_PORT = 3443} = process.env;
    secureServer.listen(SSL_PORT, () => {
        console.log(`Server listening (HTTPS) Port: ${SSL_PORT}`);
    });
}
