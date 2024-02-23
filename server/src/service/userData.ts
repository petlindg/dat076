import {ObjectId} from "mongodb";
import {UserData, UserStatistics} from "../model/userData";
import {IUserDataService} from "./interfaces/userData.interface";
import {userDataModel} from "../db/userData.db";
import {UpdateWriteOpResult} from "mongoose";
import {PowerupActive} from "../model/powerupActive";
import {powerupActiveModel} from "../db/powerupActive.db";
import {PowerupPriceHelpers} from "../helpers/powerupPriceHelpers";

export class UserDataService implements IUserDataService {
    async getUserData(userId: ObjectId): Promise<UserData> {
        const userData: UserData | null = await (await userDataModel).findOne({
            credentialsId: userId,
        });

        if (userData === null)
            throw new Error("No user with the provided Id has been found")

        return userData;
    }

    async incrementParsnip(userId: ObjectId): Promise<number> {
        const userData: UserData | null = await (await userDataModel).findOne({
            credentialsId: userId,
        });

        if (userData === null)
            throw new Error("No user with the provided Id has been found")

        const newBalance: number = userData.parsnipBalance + userData.parsnipsPerClick;
        const newLifetimeClicks: number = userData.lifetimeClicks + 1
        const newLifetimeEarned: number = userData.lifetimeParsnipsEarned + userData.parsnipsPerClick

        const res: UpdateWriteOpResult = await (await userDataModel).updateOne(
            {credentialsId: userId},
            {parsnipBalance: newBalance, lifetimeClicks: newLifetimeClicks, lifetimeParsnipsEarned: newLifetimeEarned},
        );

        if (!res.acknowledged)
            throw new Error("An error has occurred while writing results to the DB")

        return newBalance;
    }

    async purchasePowerupActive(
        userId: ObjectId,
        powerupActiveId: ObjectId,
    ): Promise<boolean> {
        const userData: UserData | null = await (await userDataModel).findOne({
            credentialsId: userId,
        });

        if (userData === null)
            throw new Error("No user with the provided Id has been found")

        const powerupActive: PowerupActive | null =
            await (await powerupActiveModel).findById(powerupActiveId);

        if (powerupActive === null)
            throw new Error("No powerup with the provided Id has been found")

        let userBalance: number = userData.parsnipBalance;
        let userPowerupsActivePurchased = userData.powerupsActivePurchased;
        let userParsnipPerClick: number = userData.parsnipsPerClick;
        const i: number = userPowerupsActivePurchased.findIndex(
            (upap) => upap.idPowerup.toString() === powerupActiveId.toString(),
        );

        let price: number = 0
        if (i >= 0) {
            const purchaseCount: number =
                userPowerupsActivePurchased[i].purchaseCount;


            price = PowerupPriceHelpers.computePrice(powerupActive.basePrice, powerupActive.increment, purchaseCount)

            if (userBalance < price) return false;

            userPowerupsActivePurchased[i] = {
                idPowerup: powerupActiveId,
                purchaseCount: purchaseCount + 1,
            };

            userBalance -= price;
            userParsnipPerClick += powerupActive.parsnipsPerClick;
        } else {
            if (userBalance < powerupActive.basePrice) return false;

            userPowerupsActivePurchased.push({
                idPowerup: powerupActiveId,
                purchaseCount: 1,
            });

            userBalance -= powerupActive.basePrice;
            userParsnipPerClick += powerupActive.parsnipsPerClick;
            price = powerupActive.basePrice
        }

        const newLifetimeSpent: number = userData.lifetimeParsnipsSpent + price;

        const res: UpdateWriteOpResult = await (await userDataModel).updateOne(
            {credentialsId: userId},
            {
                parsnipBalance: userBalance,
                parsnipsPerClick: userParsnipPerClick,
                powerupsActivePurchased: userPowerupsActivePurchased,
                lifetimeParsnipsSpent: newLifetimeSpent,
            },
        );

        return res.acknowledged;
    }

    async getUserStatistic(userId: ObjectId): Promise<UserStatistics> {
        const userData: UserData = await this.getUserData(userId)

        const totalPowerupsPurchased: number =
            userData.powerupsPassivePurchased
            .reduce((sum: number, up) => sum + up.purchaseCount, 0) +
            userData.powerupsActivePurchased
            .reduce((sum: number, up) => sum + up.purchaseCount, 0)

        return {
            idUserCredentials: userData.credentialsId,
            parsnipsPerClick: userData.parsnipsPerClick,
            parsnipBalance: userData.parsnipBalance,
            totalPowerupsPurchased: totalPowerupsPurchased,
            lifetimeClicks: userData.lifetimeClicks,
            lifetimeParsnipEarned: userData.lifetimeParsnipsEarned,
            lifetimeParsnipSpent: userData.lifetimeParsnipsSpent,
        }
    }
}
