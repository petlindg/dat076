import React, {useEffect, useState, FormEvent} from 'react';
import './App.css';
import axios from 'axios';
import {AxiosResponse} from 'axios';

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

function App() {
    const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>(undefined);
    const [userData, setUserData] = useState<UserData | undefined>(undefined);
    const [newUserName, setNewUserName] = useState<string>("")
    const url: String = "http://localhost:8080/";

    async function updateUserCredentials(): Promise<void> {
        try {
            const response = await axios.get<UserCredentials>(url + "userCredentials");
            const newUserCredentials: UserCredentials = response.data;
            setUserCredentials(newUserCredentials);
        } catch (e: any) {
            console.log(e);
        }
    }

    async function updateUserData(): Promise<void> {
        try {
            const response = await axios.get<UserData>(url + "userData");
            const newUserData: UserData = response.data;
            setUserData(newUserData);
        } catch (e: any) {
            console.log(e);
        }
    }

    async function incrementParsnip() {
        try {
            await axios.post<string>(url + "userData/incrementParsnip", {});
            await updateUserData();
        } catch (e: any) {
            console.log(e);
        }
    }

    async function purchasePowerup() {
        try {
            // TODO this hardcoded the powerupActiveId, get it dynamically
            // TODO to do that the list of powerups will have to be retrieved from the API
            const response: AxiosResponse<String, any> = await axios
                .post<String>(url + "userData/purchaseActivePowerUp", {powerupActiveId: "65d8947a15e5748f2ed42b99"});

            if (response.status === 403) {
                alert("Not enough balance for this purchase")
            } else if (response.status === 200) {
                await updateUserData();
            } else {
                alert("Unknown error occurred")
            }
        } catch (e: any) {
            alert("Not enough balance for this purchase")
            console.log(e);
        }
    }

    async function changeUsername(e: FormEvent) {
        e.preventDefault()
        if (newUserName == "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        const response = await axios.patch<String>(url + "userCredentials", {newUsername: newUserName})

        if (response.status !== 200) {
            alert("Unknown error occurred")
        }

        setNewUserName("");
        await updateUserCredentials();
    }

    useEffect(() => {
        document.title = 'Parsnip Puncher';
        updateUserCredentials();
        updateUserData();
    },[]);

    return (
        <div>
            <div>
                <p>Hello {userCredentials?.userName}!</p>
                <p id="lblParsnips">Parsnips: {userData?.parsnipBalance}</p>
                <div className="boxing-cursor parsnip-animation" onClick={incrementParsnip}>
                    <img
                        draggable="false"
                        alt='The main parsnip'
                        src={require('./assets/images/parsnip.png')}
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

export default App;
