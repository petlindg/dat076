import {Model, Schema} from "mongoose";
import {PowerupPassive} from "../model/powerupPassive";
import {db} from "./conn";

const powerupPassiveSchema: Schema = new Schema({
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

    parsnipsPerSecond: {
        type: Number,
        required: true,
    },
});

async function modelAsPromise(): Promise<Model<PowerupPassive>> {
    return (await db).model<PowerupPassive>("PowerupPassive", powerupPassiveSchema,);
}

export const powerupPassiveModel: Promise<Model<PowerupPassive>> = modelAsPromise()
