import React, {FormEvent, useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";
import {baseUrl, socket} from "../App";
import {basicErrorHandler} from "../Helpers/BasicErrorHandler";
import {UserData, UserCredentials, User} from "./User";

export async function purchasePowerup() {
    // TODO this hardcoded the powerupActiveId, get it dynamically
    // TODO to do that the list of powerups will have to be retrieved from the API
    
    await axios.post<String>(baseUrl + "userData/purchaseActivePowerUp", {powerupActiveId: "65d8947a15e5748f2ed42b99"})
        .then(async () => await updateUserData())
        .catch(basicErrorHandler)
}