import {ObjectId} from "mongodb";
import {RegisterModel, LoginModel} from "../model/auth";
import {IAuthService} from "./interfaces/auth.interface";
import {UserCredentials} from "../model/userCredentials";
import {userCredentialsModel} from "../db/userCredentials.db";
import {userDataModel} from "../db/userData.db";
import bcrypt from "bcryptjs";
import {WebError} from "../model/error";

export class AuthService implements IAuthService {
    async register(registerModel: RegisterModel): Promise<ObjectId> {

        const existingUserCredentials: UserCredentials | null = await (await userCredentialsModel).findOne({email: registerModel.email})

        if (existingUserCredentials)
            throw new WebError("User with the given email already exists", 409)

        const userCredentials: UserCredentials = await (await userCredentialsModel).create({
            email: registerModel.email,
            userName: registerModel.username,
            password: bcrypt.hashSync(registerModel.password, 8)
        })

        await (await userDataModel).create({
            credentialsId: userCredentials.id,
            parsnipsPerClick: 1,
            parsnipsPerSecond: 0,
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
        })

        if(!userCredentials || !bcrypt.compareSync(loginModel.password, userCredentials.password))
            throw new WebError("Invalid credentials", 403)

        return userCredentials.id
    }

    async isLoggedIn(userId: ObjectId): Promise<boolean>{
        const userCredentials: UserCredentials | null = await (await  userCredentialsModel).findById(userId)

        return userCredentials !== null
    }
}