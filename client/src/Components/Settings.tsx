import React, {FormEvent, useState} from 'react';
import {Api} from "../Helpers/Api";
import Button from "react-bootstrap/Button";

/**
 * React component, a page consisting of changable settings available for the user
 * @returns {Component}
 */
export function Settings() {
    const [newUserName, setNewUserName] = useState<string>("");

    async function changeUsername(e: FormEvent) {
        e.preventDefault();
        if (newUserName === "" || newUserName === undefined) {
            alert("New username may not be empty");
            return;
        }

        await Api.updateUsername(newUserName)

        setNewUserName("");
    }

    return (
        <div>
            <h3>Change username</h3>
            <label htmlFor="userNameUpdateInput">Input your new username: </label>
            <form className="loginForm" onSubmit={async (e) => await changeUsername(e)}>
                <input
                    data-testid="userNameUpdateInput"
                    id="userNameUpdateInput"
                    type="text"
                    value={newUserName}
                    required
                    onChange={(e) => {
                        setNewUserName(e.target.value);
                    }}></input>


                <Button id="userNameUpdateSubmitButton" className="c1 b1" type="submit">
                    Submit Username
                </Button>
            </form>
        </div>)
}


