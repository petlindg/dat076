import { ObjectId } from "mongodb";
import { UserCredentials } from "../model/userCredentials";
import { IUserCredentialsService } from "./interfaces/IuserCredentials";
import { userCredentialsModel } from "../db/userCredentials.db";
import { UpdateWriteOpResult } from "mongoose";

export class UserCredentialsService implements IUserCredentialsService {
  userId: ObjectId = new ObjectId("65d75e0b5df275c5654b67a3"); // TODO get from cookie

  async getUserCredentials(): Promise<UserCredentials | null> {
    const userCredentials: UserCredentials | null =
      await userCredentialsModel.findById(this.userId);

    return userCredentials;
  }

  async changeUsername(newUsername: string): Promise<boolean> {
    const res: UpdateWriteOpResult = await userCredentialsModel.updateOne(
      { _id: this.userId },
      { userName: newUsername },
    );

    return res.acknowledged;
  }
}
