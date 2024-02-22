import {ObjectId} from "mongodb";
import {UserData} from "../model/userData";
import {IUserDataService} from "./interfaces/IuserData";
import {userDataModel} from "../db/userData.db";
import {UpdateWriteOpResult} from "mongoose";
import {PowerupActive} from "../model/powerupActive";
import {powerupActiveModel} from "../db/powerupActive.db";

export class UserDataService implements IUserDataService {
    async getUserData(userId: ObjectId): Promise<UserData | null> {
        const userData: UserData | null = await userDataModel.findOne({
            credentialsId: userId,
        });

        return userData;
    }

    async incrementParsnip(userId: ObjectId): Promise<number | null> {
        const userData: UserData | null = await userDataModel.findOne({
            credentialsId: userId,
        });

        if (userData === null) return null;

        const newBalance = userData.parsnipBalance + userData.parsnipsPerClick;

        const res: UpdateWriteOpResult = await userDataModel.updateOne(
            {credentialsId: userId},
            {parsnipBalance: newBalance},
        );

        if (!res.acknowledged) return null;

        return newBalance;
    }

    async purchasePowerupActive(
        userId: ObjectId,
        powerupActiveId: ObjectId,
    ): Promise<boolean> {
        const userData: UserData | null = await userDataModel.findOne({
            credentialsId: userId,
        });

        if (userData === null) return false;

        const powerupActive: PowerupActive | null =
            await powerupActiveModel.findById(powerupActiveId);

        if (powerupActive === null) return false;

        let userBalance: number = userData.parsnipBalance;
        let userPowerupsActivePurchased = userData.powerupsActivePurchased;
        let userParsnipPerClick: number = userData.parsnipsPerClick;
        const i: number = userPowerupsActivePurchased.findIndex(
            (upap) => upap.idPowerup.toString() === powerupActiveId.toString(),
        );

        if (i >= 0) {
            const purchaseCount: number =
                userPowerupsActivePurchased[i].purchaseCount;

            let price: number = powerupActive.basePrice;
            for (let j = 0; j < purchaseCount; j++)
                price += price * powerupActive.increment

            price = Math.ceil(price)

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
        }

        const res: UpdateWriteOpResult = await userDataModel.updateOne(
            {credentialsId: userId},
            {
                parsnipBalance: userBalance,
                parsnipsPerClick: userParsnipPerClick,
                powerupsActivePurchased: userPowerupsActivePurchased,
            },
        );

        return res.acknowledged;
    }
}
