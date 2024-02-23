import {ObjectId} from "mongodb";
import {UserCredentials} from "../model/userCredentials";
import {IUserCredentialsService} from "./interfaces/IuserCredentials";
import {userCredentialsModel} from "../db/userCredentials.db";
import {UpdateWriteOpResult} from "mongoose";

export class UserCredentialsService implements IUserCredentialsService {
    async getUserCredentials(userId: ObjectId): Promise<UserCredentials> {
        const userCredentials: UserCredentials | null =
            await userCredentialsModel.findById(userId);

        if (userCredentials === null)
            throw "No user with the provided Id has been found"

        return userCredentials;
    }

    async changeUsername(
        userId: ObjectId,
        newUsername: string,
    ): Promise<boolean> {
        const res: UpdateWriteOpResult = await userCredentialsModel.updateOne(
            {_id: userId},
            {userName: newUsername},
        );

        return res.acknowledged;
    }
}
