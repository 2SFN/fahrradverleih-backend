/*
2022-07 Fahrradverleih-Backend

Einfaches Backend, das eine RESTful API für den Fahrradverleih zur
Verfügung stellt. Daten werden nicht persistiert und es sind keine
Sicherheits-Features implementiert.

Standardmäßiger Port für den WebServer: 3000
*/
import express from 'express';
import cors from 'cors';
import {CorsOptions} from "cors";
import router from "./api";

///////////////  Express & Umgebung  ///////////////
const server = express();
server.use(express.json());

// Konfiguration für CORS innerhalb der Ionic-Entwicklungsumgebung
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

// Auf Port hören
const {
    PORT = 3000,
} = process.env;

server.listen(PORT, () => {
    console.log(`Server listenening on port ${PORT}!`);
});

// API-Endpunkte (router) einbinden
server.use('/api', router);

