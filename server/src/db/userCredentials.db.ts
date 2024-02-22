import { Schema, Model } from "mongoose";
import { UserCredentials } from "../model/userCredentials";
import { db } from "./conn";

const userCredentialsSchema : Schema = new Schema({

  userName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const userCredentialsModel = db.model<UserCredentials>("UserCredentials", userCredentialsSchema);