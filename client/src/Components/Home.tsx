import React, { FormEvent, useEffect, useState } from 'react';
import axios, { AxiosResponse } from "axios";
import { baseUrl, socket } from "../App";
import { basicErrorHandler } from "../Helpers/BasicErrorHandler";
import { ClickableParsnip, incrementParsnip } from "./ClickableParsnip";
import {UserData, UserCredentials, User} from "./User";
import { PowerupActive } from './PowerupActive';

export interface IncrementParsnipsResponseModel {
    newParsnipBalance: number
}

// TODO this component should be divided into minimum of 3 (User, PowerupActive, Parsnip) components
// interfaces functions... should also be moved accordingly
// All 3 of those should be "put together" in this Home component
// The home component is then rendered by the app at the "/" link
// This is mainly to manage routing so "/" and "/something" can display separate views
function Home() {
    useEffect(() => {
        document.title = 'Parsnip Puncher';
    }, []);

    return (
        <div>
            <User></User>
            <ClickableParsnip></ClickableParsnip>
            <PowerupActive></PowerupActive>
        </div>
    );
}

export default Home;