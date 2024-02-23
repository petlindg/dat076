import {Connection, createConnection} from "mongoose";
const env = require("../env.json");

const URI: string = `mongodb+srv://${env.mongoUser}:${env.mongoPassword}@parsnip-puncher.7shlst9.mongodb.net/?retryWrites=true&w=majority&appName=parsnip-puncher`;

async function createMongoPromise(): Promise<Connection> {
    return createConnection(URI)
}
export const db : Promise<Connection> = createMongoPromise();
