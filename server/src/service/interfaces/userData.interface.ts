import {ObjectId} from "mongodb";
import {leaderboardSortBy, userCursor, UserData, UserLeaderboard, UserStatistics} from "../../model/userData";

export interface IUserDataService {
    /**
     * Return user data for the given user, null if the user could not be found
     * @param userId
     * @returns UserData
     * @throws WebError - if user not found
     */
    getUserData(userId: ObjectId): Promise<UserData>;

    /**
     * Increments parsnip of the given user by their parsnipPerClick
     * @param userId - id of user to have parsnip incremented
     * @returns the new number of parsnips the user has
     * @throws WebError - if user not found
     */
    incrementParsnip(userId: ObjectId): Promise<number>;

    /**
     * Purchase the given powerup for a given user
     * Automatically calculates the price and increments the number of times it was purchased
     * @param userId id of user to purchase the powerup
     * @param powerupActiveId id of the powerup to purchase
     * @returns true on success, false else (e.g. if user can not afford the powerup)
     * @throws WebError - if user or powerup are not found
     */
    purchasePowerupActive(
        userId: ObjectId,
        powerupActiveId: ObjectId,
    ): Promise<boolean>;

    /**
     * Reads the statistic from the DB and calculates the rest
     * @param userId id of the user to get statistics for
     * @returns UserStatistics
     * @throws WebError - if there is no user data for userId
     */
    getUserStatistic(userId: ObjectId): Promise<UserStatistics>

    /**
     * Return a leaderboard of "limit" registered users, ranked by sortBy from best to worst
     * @param sortBy
     * @param limit
     * @returns UserLeaderboard[] - a list of users sorted by sortBy
     * @throws WebError - if sorted by is not of type leaderboardSortBy
     */
    getUserLeaderboard(sortBy: leaderboardSortBy, limit: number): Promise<UserLeaderboard[]>

    /**
     * Purchase the given powerup for a given user
     * Automatically calculates the price and increments the number of times it was purchased
     * @param userId id of user to purchase the powerup
     * @param powerupPassiveId id of the powerup to purchase
     * @returns true on success, false else (e.g. if user can not afford the powerup)
     * @throws WebError - if user or powerup are not found
     */
    purchasePowerupPassive(
        userId: ObjectId,
        powerupPassiveId: ObjectId,
    ): Promise<boolean>;

    /**
     * Increments parsnipBalance of the given user by their parsnipPerSecond
     * @param userId - id of user to have parsnip incremented
     * @returns the new number of parsnips the user has
     * @throws WebError - if user not found
     */
    incrementParsnipsPassive(userId: ObjectId): Promise<number>;

    /**
     * Updates the cursor preference of the given user to the new one
     * @param userId
     * @param cursor
     * @returns boolean - true on success, false else
     */
    updateCursor(userId: ObjectId, cursor: userCursor): Promise<boolean>
}
