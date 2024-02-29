import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";
import {baseUrl} from "../App";
import {basicErrorHandler} from "../Helpers/BasicErrorHandler";
import {ClickableParsnip} from "./ClickableParsnip";
import {User} from "./User";
import {PowerupActiveList} from './PowerupActive';
import {UserData} from "../Models/Api";

// TODO this component should be divided into minimum of 3 (User, PowerupActive, Parsnip) components
// interfaces functions... should also be moved accordingly
// All 3 of those should be "put together" in this Home component
// The home component is then rendered by the app at the "/" link
// This is mainly to manage routing so "/" and "/something" can display separate views
function Home() {
    const [userData, setUserData] = useState<UserData | undefined>(undefined);

    useEffect(() => {
        document.title = 'Parsnip Puncher';
    }, []);

    async function updateUserData(): Promise<void> {
        await axios.get<UserData>(baseUrl + "userData")
            .then((response: AxiosResponse<UserData>) => {
                const newUserData: UserData = response.data;
                setUserData(newUserData);
            }).catch(basicErrorHandler)
    }

    return (
        <div>
            <User userData={userData} setUserData={setUserData} updateUserData={updateUserData}/>
            <ClickableParsnip/>
            <PowerupActiveList updateUserData={updateUserData}/>
        </div>
    );
}

export default Home;