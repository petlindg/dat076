import {Connection, createConnection} from "mongoose";

const URI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@parsnip-puncher.7shlst9.mongodb.net/?retryWrites=true&w=majority&appName=parsnip-puncher`;

async function createMongoPromise(): Promise<Connection> {
    return createConnection(URI)
}
export const db : Promise<Connection> = createMongoPromise();
