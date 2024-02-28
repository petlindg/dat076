import React, { FormEvent, useEffect, useState } from 'react';
import axios, { AxiosResponse } from "axios";
import { baseUrl, socket } from "../App";
import { basicErrorHandler } from "../Helpers/BasicErrorHandler";
import { incrementParsnip } from "./ClickableParsnip";

interface UserPurchases {
    idPowerup: string;
    purchaseCount: number;
}

export interface UserData {
    id: string;
    credentialsId: string;
    parsnipsPerClick: number;
    parsnipBalance: number;
    powerupsActivePurchased: UserPurchases[];
    powerupsPassivePurchased: UserPurchases[];
    // TODO add all statistics
}

export interface UserCredentials {
    id: string;
    userName: String;
    email: String;
    password: String;
}
export function User() {
     const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>(undefined);
     const [userData, setUserData] = useState<UserData | undefined>(undefined);
     const [newUserName, setNewUserName] = useState<string>("")

     async function updateUserCredentials(): Promise<void> {
        await axios.get<UserCredentials>(baseUrl + "userCredentials")
            .then((response: AxiosResponse<UserCredentials>) => {
                const newUserCredentials: UserCredentials = response.data;
                setUserCredentials(newUserCredentials);
            }).catch(basicErrorHandler)
    }

     async function updateUserData(): Promise<void> {
        await axios.get<UserData>(baseUrl + "userData")
            .then((response: AxiosResponse<UserData>) => {
                const newUserData: UserData = response.data;
                setUserData(newUserData);
            }).catch(basicErrorHandler)
    }

     async function changeUsername(e: FormEvent) {
        e.preventDefault()
        if (newUserName === "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        await axios.patch<String>(baseUrl + "userCredentials", { newUsername: newUserName })
            .catch(basicErrorHandler)

        setNewUserName("");
        await updateUserCredentials();
    }
}