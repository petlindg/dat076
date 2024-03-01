import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { ClickableParsnip } from "./ClickableParsnip";
import { User } from "./User";
import { PowerupActiveList } from './PowerupActive';
import { UserData } from "../Models/Api";
import { Api } from "../Helpers/Api";
import { PowerupPassiveList } from './PowerupPassive';
import {NavigateFunction, useNavigate} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../App.css'

export function Settings(){
    useEffect(() => {}, []);
    return(<div></div>)
}