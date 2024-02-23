import {Schema} from "mongoose";
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

export const powerupActiveModel = db.model<PowerupActive>(
    "PowerupActive",
    powerupActiveSchema,
);
