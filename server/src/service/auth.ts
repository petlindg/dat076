import {ObjectId} from "mongodb";
import {RegisterModel, LoginModel} from "../model/auth";
import {IAuthService} from "./interfaces/auth.interface";
import {UserCredentials} from "../model/userCredentials";
import {userCredentialsModel} from "../db/userCredentials.db";
import {Error} from "mongoose";
import {userDataModel} from "../db/userData.db";

export class AuthService implements IAuthService {
    async register(registerModel: RegisterModel): Promise<ObjectId> {

        const existingUserCredentials: UserCredentials | null = await (await userCredentialsModel).findOne({email: registerModel.email})

        if (existingUserCredentials)
            throw new Error("User with the given email already exists")

        const userCredentials: UserCredentials = await (await userCredentialsModel).create({
            email: registerModel.email,
            userName: registerModel.username,
            password: registerModel.password
        })

        await (await userDataModel).create({
            credentialsId: userCredentials.id,
            parsnipsPerClick: 1,
            parsnipBalance: 0,
            powerupsActivePurchased: [],
            powerupsPassivePurchased: [],
            lifetimeClicks: 0,
            lifetimeParsnipsEarned: 0,
            lifetimeParsnipsSpent: 0,
        })

        return userCredentials.id
    }

    async login(loginModel: LoginModel): Promise<ObjectId> {

        const userCredentials : UserCredentials | null = await (await userCredentialsModel).findOne({
            email : loginModel.email,
            password : loginModel.password
        })

        if(!userCredentials)
            throw new Error("Invalid credentials")

        return userCredentials.id
    }
}