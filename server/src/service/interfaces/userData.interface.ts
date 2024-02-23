import {ObjectId} from "mongodb";
import {UserData, UserStatistics} from "../../model/userData";

export interface IUserDataService {
    /**
     * Return user data for the given user, null if the user could not be found
     * @param userId
     * @returns UserData
     * @throws exception if user not found
     */
    getUserData(userId: ObjectId): Promise<UserData>;

    /**
     * Increments parsnip of the given user by their parsnipPerClick
     * @param userId - id of user to have parsnip incremented
     * @returns the new number of parsnips the user has
     * @throws exception if user not found
     */
    incrementParsnip(userId: ObjectId): Promise<number>;

    /**
     * Purchase the given powerup for a given user
     * Automatically calculates the price and increments the number of times it was purchased
     * @param userId id of user to purchase the powerup
     * @param powerupActiveId if of the powerup to purchase
     * @returns true on success, false else (e.g. if user can not afford the powerup)
     * @throws exception if user or powerup are not found
     */
    purchasePowerupActive(
        userId: ObjectId,
        powerupActiveId: ObjectId,
    ): Promise<boolean>;

    /**
     * Reads the statistic from the DB and calculates the rest
     * @param userId id of the user to get statistics for
     * @returns UserStatistics
     * @throws if there is no user data for userId
     */
    getUserStatistic(userId: ObjectId): Promise<UserStatistics>
}