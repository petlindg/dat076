import {Model, Schema} from "mongoose";
import {PowerupActive} from "../model/powerupActive";
import {db} from "./conn";

const powerupActiveSchema: Schema = new Schema({
    powerupName: {
        type: String,
        required: true,
        unique: true
    },

    basePrice: {
        type: Number,
        required: true,
    },

    increment: {
        type: Number,
        required: true,
    },

    parsnipsPerClick: {
        type: Number,
        required: true,
    },
});

async function modelAsPromise(): Promise<Model<PowerupActive>> {
    return (await db).model<PowerupActive>("PowerupActive", powerupActiveSchema,);
}

export const powerupActiveModel: Promise<Model<PowerupActive>> = modelAsPromise()
