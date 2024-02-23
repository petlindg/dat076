import {Model, Schema} from "mongoose";
import {UserCredentials} from "../model/userCredentials";
import {db} from "./conn";

const userCredentialsSchema: Schema = new Schema(
    {
        userName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },
    },
    {timestamps: true},
);

async function modelAsPromise(): Promise<Model<UserCredentials>> {
    return (await db).model<UserCredentials>("UserCredentials", userCredentialsSchema,);
}

export const userCredentialsModel: Promise<Model<UserCredentials>> = modelAsPromise()
