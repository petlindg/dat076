import {ObjectId} from "mongodb";
import {UserCredentials} from "../../model/userCredentials";

export interface IUserCredentialsService {
    /**
     * @param userId id of the user to fetch
     * @returns user credentials of the given user, null if the user does not exist (shouldn't happen)
     */
    getUserCredentials(userId: ObjectId): Promise<UserCredentials | null>;

    /**
     * Changes the username of the user given user to newUsername
     * @param userId id of user to update the username of
     * @param newUsername new username to set for the user
     * @returns true on success, false else
     */
    changeUsername(userId: ObjectId, newUsername: string): Promise<boolean>;
}
