import express from 'express';
import { Request, Response } from 'express';
import Person from './model/person';

const server = express();

const {
    PORT = 3000,
} = process.env;

server.listen(PORT, () => {
    console.log(`Server listenening on port ${PORT}!`);
});
