import {ObjectId} from "mongodb";
import {UserCredentials} from "../model/userCredentials";
import {IUserCredentialsService} from "./interfaces/userCredentials.interface";
import {userCredentialsModel} from "../db/userCredentials.db";
import {Model, UpdateWriteOpResult} from "mongoose";
import {UserData} from "../model/userData";
import {StringHelpers} from "../helpers/stringHelpers";
import {WebError} from "../model/error";

export class UserCredentialsService implements IUserCredentialsService {
    async getUserCredentials(userId: ObjectId): Promise<UserCredentials> {
        const userCredentials: UserCredentials | null =
            await (await userCredentialsModel).findById(userId);

        if (userCredentials === null)
            throw new WebError("No user with the provided Id has been found", 404)

        return userCredentials;
    }

    async changeUsername(
        userId: ObjectId,
        newUsername: string,
    ): Promise<boolean> {
        let userCredentials : UserCredentials | null = await (await  userCredentialsModel).findById(userId)

        if (userCredentials === null)
            throw new WebError("No user with the provided Id has been found", 404)

        if(StringHelpers.isNullOrEmpty(newUsername))
            throw new WebError("newUsername may not be null or empty", 400)

        const res: UpdateWriteOpResult = await (await userCredentialsModel).updateOne(
            {_id: userId},
            {userName: newUsername},
        );

        return res.acknowledged;
    }
}
