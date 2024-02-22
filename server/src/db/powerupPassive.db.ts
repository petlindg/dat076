import {Schema, Model} from "mongoose";
import { PowerupPassive } from "../model/powerupPassive";
import { db } from "./conn";


const powerupPassiveSchema : Schema = new Schema({

    poweupName : {
        type : String,
        required : true
    },

    basePrice : {
        type : Number,
        required : true
    },

    increment : {
        type : Number,
        required : true
    },

    parsnipsPerSecond : {
        type : Number,
        required : true
    },
});

export const powerupPassiveModel = db.model<PowerupPassive>("PoweupPassive", powerupPassiveSchema);
