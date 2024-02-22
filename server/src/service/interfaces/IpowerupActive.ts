import {ObjectId} from "mongodb";
import {PowerupActiveResponseModel} from "../../model/powerupActiveResponseModel";

export interface IpowerupActiveService {

    /**
     * Return a list on all powerups in the DB while adjusting the "priceForUser" based on amount of previous purchases
     * Results are sorted by base price
     * @param userId - id of the user for which the prices should be adjusted
     * @return a list of powerups, with the user specific price if user is null, it returns the list without precomputed prices
     */
    getPowerupActiveList(userId : ObjectId) : Promise<PowerupActiveResponseModel[]>
}