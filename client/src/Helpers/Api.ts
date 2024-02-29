import axios, {AxiosResponse} from "axios";
import {UserCredentials} from "../Components/Home";
import {baseUrl} from "../App";
import {basicErrorHandler} from "./BasicErrorHandler";

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
}

