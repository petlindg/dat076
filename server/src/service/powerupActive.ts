import {ObjectId} from "mongodb";
import {PowerupActiveResponseModel} from "../model/powerupActiveResponseModel";
import {IpowerupActiveService} from "./interfaces/IpowerupActive";
import {UserData} from "../model/userData";
import {userDataModel} from "../db/userData.db";
import {PowerupActive} from "../model/powerupActive";
import {powerupActiveModel} from "../db/powerupActive.db";
import {PowerupPriceHelpers} from "../helpers/powerupPriceHelpers";

export class PowerupActiveService implements IpowerupActiveService {
    async getPowerupActiveList(userId: ObjectId): Promise<PowerupActiveResponseModel[]> {
        const userData: UserData | null = await userDataModel.findOne({
            credentialsId: userId,
        });

        const powerupsActive: PowerupActive[] = await powerupActiveModel.find();
        let result: PowerupActiveResponseModel[] = []

        for (let i = 0; i < powerupsActive.length; i++) {
            const pa: PowerupActive = powerupsActive[i];
            let responseModel: PowerupActiveResponseModel = ({
                id: pa.id,
                powerupName: pa.powerupName,
                basePrice: pa.basePrice,
                increment: pa.increment,
                parsnipsPerClick: pa.parsnipsPerClick,
                priceForUser: pa.basePrice
            })

            if (userData !== null) {
                const userPurchase = userData.powerupsActivePurchased.find(up => up.idPowerup.toString() == pa.id.toString())
                let userPurchaseCount: number = (userPurchase === undefined) ? 0 : userPurchase.purchaseCount
                responseModel.priceForUser = PowerupPriceHelpers.computePrice(pa.basePrice, pa.increment, userPurchaseCount)
            }

            result.push(responseModel)
        }

        result.sort((a: PowerupActiveResponseModel, b: PowerupActiveResponseModel) => a.basePrice - b.basePrice)
        return result;
    }

}