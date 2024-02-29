import React, {useEffect, useState} from 'react';
import {ClickableParsnip} from "./ClickableParsnip";
import {User} from "./User";
import {PowerupActiveList} from './PowerupActive';
import {UserData} from "../Models/Api";
import {Api} from "../Helpers/Api";

function Home() {
    const [userData, setUserData] = useState<UserData | undefined>(undefined);

    useEffect(() => {
        document.title = 'Parsnip Puncher';
    }, []);

    async function updateUserData(): Promise<void> {
        await Api.getUserData().then((response: UserData | undefined) => {
            if (response)
                setUserData(response)
        })
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