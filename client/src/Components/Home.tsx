import React, {FormEvent, useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";
import {baseUrl, socket} from "../App";
import {basicErrorHandler} from "../Helpers/BasicErrorHandler";

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

export interface IncrementParsnipsResponseModel {
    newParsnipBalance: number
}

// TODO this component should be divided into minimum of 3 (User, PowerupActive, Parsnip) components
// interfaces functions... should also be moved accordingly
// All 3 of those should be "put together" in this Home component
// The home component is then rendered by the app at the "/" link
// This is mainly to manage routing so "/" and "/something" can display separate views
function Home() {
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

    async function incrementParsnip() {
        socket.emit("parsnipClick")
    }

    async function purchasePowerup() {
        // TODO this hardcoded the powerupActiveId, get it dynamically
        // TODO to do that the list of powerups will have to be retrieved from the API
        await axios.post<String>(baseUrl + "userData/purchaseActivePowerUp", {powerupActiveId: "65d8947a15e5748f2ed42b99"})
            .then(async () => await updateUserData())
            .catch(basicErrorHandler)
    }

    async function changeUsername(e: FormEvent) {
        e.preventDefault()
        if (newUserName === "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        await axios.patch<String>(baseUrl + "userCredentials", {newUsername: newUserName})
            .catch(basicErrorHandler)

        setNewUserName("");
        await updateUserCredentials();
    }

    useEffect(() => {
        document.title = 'Parsnip Puncher';
        updateUserCredentials();
        updateUserData();
        socket.on("parsnipBalance", (data) => {
            setUserData((prevUserData: UserData | undefined) => {
                if (prevUserData === undefined)
                    return undefined

                return {
                    ...prevUserData,
                    parsnipBalance: parseInt(data)
                };
            })
        })

    }, []);


    return (
        <div>
            <div>
                <p>Hello {userCredentials?.userName}!</p>
                <p id="lblParsnips">Parsnips: {userData?.parsnipBalance}</p>
                <div className="boxing-cursor parsnip-animation" onClick={incrementParsnip}>
                    <img
                        draggable="false"
                        alt='The main parsnip'
                        src={require('../assets/images/parsnip.png')}
                    />
                </div>
            </div>
            <p id="lblPPC">{userData?.parsnipsPerClick} Parsnips Per Click (PPC)</p>
            <button onClick={purchasePowerup}>
                Buy Powerup
            </button>
            <p>Change username</p>
            <label htmlFor="userNameUpdateInput">Input your new username: </label>
            <form onSubmit={async e => await changeUsername(e)}>
                <input data-testid="userNameUpdateInput" id="userNameUpdateInput" type="text" value={newUserName}
                       onChange={e => {
                           setNewUserName(e.target.value);
                       }}></input>
                <button id="userNameUpdateSubmitButton" type="submit">
                    Submit Username
                </button>
            </form>
        </div>
    );
}

export default Home;
