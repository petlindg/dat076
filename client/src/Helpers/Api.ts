import axios, {AxiosResponse} from "axios";
import {UserCredentials} from "../Components/Home";
import {baseUrl} from "../App";
import {basicErrorHandler} from "./BasicErrorHandler";

interface PowerupActive {
    id: string;
    powerupName: string;
    basePrice: number;
    increment: number;
    parsnipsPerSecond: number;
    priceForUser: number;

}

export class Api {

    static async updateUserCredentials(): Promise<UserCredentials | undefined> {
        let userCredentials: UserCredentials | undefined

        await axios.get<UserCredentials>(baseUrl + "userCredentials")
            .then((response: AxiosResponse<UserCredentials>) => {
                userCredentials = response.data
            })
            .catch(basicErrorHandler)

        return userCredentials
    }

    static async purchasePowerupActive(powerupActiveId: string): Promise<void> {
        await axios
            .post<String>(baseUrl + "userData/purchaseActivePowerUp", {powerupActiveId: powerupActiveId})
            .catch(basicErrorHandler)
    }

    static async getPowerupsActiveList(): Promise<PowerupActive[] | undefined> {

        let powerupActiveList : PowerupActive[] | undefined

        await axios.get(baseUrl + "powerUpActive")
            .then((response) => {
                powerupActiveList = response.data
            })
            .catch(basicErrorHandler)

        return powerupActiveList
    }
}

