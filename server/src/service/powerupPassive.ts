import {ObjectId} from "mongodb";
import {PowerupPassiveResponseModel} from "../model/powerupPassiveResponseModel";
import {IPowerupPassiveService} from "./interfaces/powerupPassive.interface";
import {PowerupPassive} from "../model/powerupPassive";
import {WebError} from "../model/error";
import {userDataModel} from "../db/userData.db";
import {UserData} from "../model/userData";
import {PowerupPriceHelpers} from "../helpers/powerupPriceHelpers";
import {powerupPassiveModel} from "../db/powerupPassive.db";

export class PowerupPassiveService implements IPowerupPassiveService {
    async getPowerupPassiveList(userId: ObjectId): Promise<PowerupPassiveResponseModel[]> {
            const userData: UserData | null = await (await userDataModel).findOne({
                credentialsId: userId,
            });

            if (userData === null)
                throw new WebError("No user with the provided Id has been found", 404)

            const powerupsPassive: PowerupPassive[] = await (await powerupPassiveModel).find();
            let result: PowerupPassiveResponseModel[] = []

            for (let i: number = 0; i < powerupsPassive.length; i++) {
                const pa: PowerupPassive = powerupsPassive[i];
                let responseModel: PowerupPassiveResponseModel = ({
                    id: pa.id,
                    powerupName: pa.powerupName,
                    basePrice: pa.basePrice,
                    increment: pa.increment,
                    parsnipsPerSecond: pa.parsnipsPerSecond,
                    priceForUser: pa.basePrice
                })

                const userPurchase = userData.powerupsPassivePurchased.find(up => up.idPowerup.toString() == pa.id.toString())
                let userPurchaseCount: number = (userPurchase === undefined) ? 0 : userPurchase.purchaseCount
                responseModel.priceForUser = PowerupPriceHelpers.computePrice(pa.basePrice, pa.increment, userPurchaseCount)

                result.push(responseModel)
            }

            result.sort((a: PowerupPassiveResponseModel, b: PowerupPassiveResponseModel) => a.basePrice - b.basePrice)
            return result;
        }
}