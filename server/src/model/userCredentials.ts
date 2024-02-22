import {ObjectId} from "mongodb";

export interface UserCredentials {
    id: ObjectId;
    userName: String;
    email: String;
    password: String;
}
