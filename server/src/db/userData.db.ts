import {Model, Schema} from "mongoose";
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
        default: 1,
    },

    parsnipsPerSecond: {
        type: Number,
        required: true,
        default: 0,
    },

    parsnipBalance: {
        type: Number,
        required: true,
        default: 0,
    },

    powerupsActivePurchased: [userActivePurchasesSchema],

    powerupsPassivePurchased: [userPassivePurchasesSchema],

    lifetimeClicks: {
        type: Number,
        required: true,
        default: 0
    },

    lifetimeParsnipsEarned: {
        type: Number,
        required: true,
        default: 0
    },

    lifetimeParsnipsSpent: {
        type: Number,
        required: true,
        default: 0
    },
});

async function modelAsPromise(): Promise<Model<UserData>> {
    return (await db).model<UserData>("UserData", userDataSchema)
}

export const userDataModel: Promise<Model<UserData>> = modelAsPromise()
