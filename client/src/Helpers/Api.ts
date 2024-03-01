import axios, {AxiosResponse} from "axios";
import {baseUrl} from "../App";
import {basicErrorHandler} from "./BasicErrorHandler";
import {
    LeaderboardQuery,
    LoginModel,
    PowerupActive,
    PowerupPassive,
    RegisterModel,
    UserCredentials,
    UserData,
    UserLeaderboard,
    UserStatistics
} from "../Models/Api";
import { FormEvent } from "react";

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

    static async updateUsername(newUsername: string): Promise<void> {
        await axios.patch(baseUrl + "userCredentials", {newUsername: newUsername}).catch(basicErrorHandler)
    }

    /* static async changeUsername(newUserName: string): Promise<void> {
        
        if (newUserName === "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        await Api.updateUsername(newUserName)

        setNewUserName("");
        await updateUserCredentials();
    } */

    static async getUserData(): Promise<UserData | undefined> {
        let userData: UserData | undefined

        await axios.get(baseUrl + "userData")
            .then((response: AxiosResponse<UserData>) => userData = response.data)
            .catch(basicErrorHandler)

        return userData
    }

    static async getUserStatistics(): Promise<UserStatistics | undefined> {
        let userStatistics: UserStatistics | undefined

        await axios.get(baseUrl + "userData/statistics")
            .then((response: AxiosResponse<UserStatistics>) => userStatistics = response.data)
            .catch(basicErrorHandler)

        return userStatistics
    }

    static async getUsersLeaderboard(query: LeaderboardQuery): Promise<UserLeaderboard[]> {
        let usersLeaderboard: UserLeaderboard[] = []

        await axios.get(baseUrl + "userData/leaderboard", {params: query})
            .then((response: AxiosResponse<UserLeaderboard[]>) => usersLeaderboard = response.data)
            .catch(basicErrorHandler)

        return usersLeaderboard
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

        let powerupActiveList: PowerupActive[] = []

        await axios.get(baseUrl + "powerUpActive")
            .then((response: AxiosResponse<PowerupActive[]>) => powerupActiveList = response.data)
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

        let powerupPassiveList: PowerupPassive[] = []

        await axios.get(baseUrl + "powerUpPassive")
            .then((response: AxiosResponse<PowerupPassive[]>) => powerupPassiveList = response.data)
            .catch(basicErrorHandler)

        return powerupPassiveList
    }

    /**
     * Checks if user is logged in
     * @returns boolean - true if validly logged in false else
     */
    static async getIsLoggedIn(): Promise<boolean> {
        let isLoggedIn: boolean = false

        await axios.get(baseUrl + "auth")
            .then((response: AxiosResponse<boolean>) => isLoggedIn = response.data)
            .catch(basicErrorHandler)

        return isLoggedIn
    }

    /**
     * Registers a new user into the system
     * @param registerModel - credentials of the new user
     */
    static async register(registerModel: RegisterModel): Promise<boolean> {
        let success: boolean = true

        await axios.post<String>(baseUrl + "auth/register", {
            email: registerModel.email,
            password: registerModel.password,
            username: registerModel.username
        }).catch(error => {
            success = false
            basicErrorHandler(error)
        })

        return success
    }

    /**
     * Logs an existing user into the system
     * @param loginModel - credentials of an existing user to login
     */
    static async login(loginModel: LoginModel): Promise<boolean>{
        let success: boolean = true

        await axios.post<String>(baseUrl + "auth/login", {
            email: loginModel.email,
            password: loginModel.password,
        }).catch(error => {
            success = false
            basicErrorHandler(error)
        })

        return success
    }

    /**
     * Logs the user out by clearing their session
     */
    static async logout(): Promise<void>{
        await axios.delete(baseUrl + "auth/logout").catch(basicErrorHandler)
    }
}

