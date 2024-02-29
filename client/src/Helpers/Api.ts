import axios, {AxiosResponse} from "axios";
import {baseUrl} from "../App";
import {basicErrorHandler} from "./BasicErrorHandler";
import {PowerupActive, PowerupPassive, UserCredentials} from "../Models/Api";

export class Api {

    /**
     * Get the user credentials of the logged-in user from the api
     * @return UserCredentials
     */
    static async getUserCredentials(): Promise<UserCredentials | undefined> {
        let userCredentials: UserCredentials | undefined

        await axios.get<UserCredentials>(baseUrl + "userCredentials")
            .then((response: AxiosResponse<UserCredentials>) => {
                userCredentials = response.data
            })
            .catch(basicErrorHandler)

        return userCredentials
    }

    /**
     * Purchases a given active powerup for the logged-in user
     * @param powerupActiveId string of the objectId of the active powerup to purchase
     */
    static async purchasePowerupActive(powerupActiveId: string): Promise<void> {
        await axios
            .post<String>(baseUrl + "userData/purchaseActivePowerUp", {powerupActiveId: powerupActiveId})
            .catch(basicErrorHandler)
    }

    /**
     * Retrieves a list of all active powerups from the API, including their prices for the logged-in user
     * @returns PowerupActive[]
     */
    static async getPowerupsActiveList(): Promise<PowerupActive[]> {

        let powerupActiveList : PowerupActive[] = []

        await axios.get(baseUrl + "powerUpActive")
            .then((response) => {
                powerupActiveList = response.data
            })
            .catch(basicErrorHandler)

        return powerupActiveList
    }

    /**
     * Purchases a given active powerup for the logged-in user
     * @param powerupPassiveId string of the objectId of the passive powerup to purchase
     */
    static async purchasePowerupPassive(powerupPassiveId: string): Promise<void> {
        await axios
            .post<String>(baseUrl + "userData/purchasePassivePowerUp", {powerupPassiveId: powerupPassiveId})
            .catch(basicErrorHandler)
    }

    /**
     * Retrieves a list of all passive powerups from the API, including their prices for the logged-in user
     * @returns PowerupPassive[]
     */
    static async getPowerupsPassiveList(): Promise<PowerupPassive[]> {

        let powerupPassiveList : PowerupPassive[] = []

        await axios.get(baseUrl + "powerUpPassive")
            .then((response) => {
                powerupPassiveList = response.data
            })
            .catch(basicErrorHandler)

        return powerupPassiveList
    }
}

