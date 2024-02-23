import {ObjectId} from "mongodb";

export interface UserCredentials {
    id: ObjectId;
    userName: string;
    email: string;
    password: string;
}
