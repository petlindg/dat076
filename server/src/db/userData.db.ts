import {Schema} from "mongoose";
import {UserData} from "../model/userData";
import {db} from "./conn";
import {ObjectId} from "mongodb";

const userActivePurchasesSchema: Schema = new Schema(
    {
        idPowerup: {
            type: ObjectId,
            required: true,
            ref: "PowerupActive"
        },
        purchaseCount: {
            type: Number,
            required: true,
        },
    },
    {_id: false},
);

const userPassivePurchasesSchema: Schema = new Schema(
    {
        idPowerup: {
            type: ObjectId,
            required: true,
            ref: "PowerupPassive"
        },
        purchaseCount: {
            type: Number,
            required: true,
        },
    },
    {_id: false},
);

const userDataSchema: Schema = new Schema({
    credentialsId: {
        type: ObjectId,
        required: true,
        ref: "UserCredentials",
        unique: true,
    },

    parsnipsPerClick: {
        type: Number,
        required: true,
    },

    parsnipBalance: {
        type: Number,
        required: true,
    },

    powerupsActivePurchased: [userActivePurchasesSchema],

    powerupsPassivePurchased: [userPassivePurchasesSchema],
});

export const userDataModel = db.model<UserData>("UserData", userDataSchema);
