import mongoose, {Connection, createConnection} from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

async function getMemoryServerConnection(): Promise<Connection> {
    const mongo: MongoMemoryServer = await MongoMemoryServer.create();
    const uri: string = mongo.getUri();
    return createConnection(uri)
}

export const db: Promise<Connection> = getMemoryServerConnection()