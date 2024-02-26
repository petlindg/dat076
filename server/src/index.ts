require('dotenv').config();

import {socketSetup} from "../socket";
import {app, corsOptions} from "./start";
import http from 'http';
import {Server} from 'socket.io';

/**
 * App Variables
 */
const PORT: number = 8080;

/**
 * Setup Socket
 */
const server: http.Server = http.createServer(app);
export const io: Server = new Server(server, {cors: corsOptions});
socketSetup()
/**
 * Server Activation
 */
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
