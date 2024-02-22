import {ObjectId} from "mongodb";
import {UserData} from "../../model/userData";

export interface IUserDataService {
    /**
     * Return user data for the given user, null if the user could not be found
     * @param userId
     * @returns UserData
     */
    getUserData(userId: ObjectId): Promise<UserData | null>;

    /**
     * Increments parsnip of the given user
     * @param userId - id of user to have parsnip incremented
     * @returns the new number of parsnips the user has
     */
    incrementParsnip(userId: ObjectId): Promise<number | null>;

    /**
     * Purchase the given powerup for a given user
     * Automatically calculates the price and increments the number of times it was purchased
     * @param userId id of user to purchase the powerup
     * @param powerupActiveId if of the powerup to purchase
     * @returns true on success, false else (e.g. if user can not afford the powerup
     */
    purchasePowerupActive(
        userId: ObjectId,
        powerupActiveId: ObjectId,
    ): Promise<boolean>;
}
