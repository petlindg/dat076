import {ObjectId} from "mongodb";
import {PowerupActiveResponseModel} from "../../model/powerupActiveResponseModel";

export interface IPowerupActiveService {

    /**
     * Return a list of all passive powerups in the DB while adjusting the "priceForUser" based on amount of previous purchases
     * Results are sorted by base price
     * @param userId - id of the user for which the prices should be adjusted
     * @return PowerupActiveResponseModel[] - a list of powerups, with the user specific price
     * @throws exception if user not found
     */
    getPowerupActiveList(userId : ObjectId) : Promise<PowerupActiveResponseModel[]>
}