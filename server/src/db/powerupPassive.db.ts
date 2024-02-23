import {Schema} from "mongoose";
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

export const powerupPassiveModel = db.model<PowerupPassive>(
    "PowerupPassive",
    powerupPassiveSchema,
);
