import { Schema, Model } from "mongoose";
import { UserData } from "../model/userData";
import { db } from "./conn";

const userPurchasesSchema : Schema = new Schema({
    
    idPowerup : {
        type : Number,
        required : true
    },
    purchaseCount  : {
        type : Number,
        required : true
    },
}, { _id: false })

const userDataSchema : Schema = new Schema({

    credentialsId : {
        type : Number,
        required : true
    },

    parsnipsPerClick : {
        type: Number,
        required: true
    },

    parsnipBalance :{
        type: Number,
        required: true
    },
    
    powerupsActivePurchased: [userPurchasesSchema],

    powerupsPassivePurchased: [userPurchasesSchema],
});

export const userDataModel = db.model<UserData>("UserData", userDataSchema);