import React, {FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {baseUrl, socket} from "../App";
import {basicErrorHandler} from "../Helpers/BasicErrorHandler";
import {UserCredentials, UserData} from "./Home";
import {Api} from "../Helpers/Api";

export function User({
  userData,
  setUserData,
  updateUserData,
}: {
  userData: UserData | undefined;
  setUserData: any;
  updateUserData: () => void;
}) {
  const [userCredentials, setUserCredentials] = useState<
    UserCredentials | undefined
  >(undefined);
  const [newUserName, setNewUserName] = useState<string>("");

  async function updateUserCredentials(): Promise<void> {
      const newUserCredentials: UserCredentials | undefined = await Api.updateUserCredentials()

      if(newUserCredentials)
          setUserCredentials(newUserCredentials)
  }

  async function changeUsername(e: FormEvent) {
    e.preventDefault();
    if (newUserName === "" || newUserName === undefined) {
      alert("New username may not be empty");
      return;
    }

    await axios
      .patch<String>(baseUrl + "userCredentials", { newUsername: newUserName })
      .catch(basicErrorHandler);

    setNewUserName("");
    await updateUserCredentials();
  }

  useEffect(() => {
    updateUserCredentials();
    updateUserData();
    socket.on("parsnipBalance", (data) => {
      setUserData((prevUserData: UserData | undefined) => {
        if (prevUserData === undefined) return undefined;

        return {
          ...prevUserData,
          parsnipBalance: parseInt(data),
        };
      });
    });
  }, []);

  return (
    <div>
      <p>Change username</p>
      <label htmlFor="userNameUpdateInput">Input your new username: </label>
      <form onSubmit={async (e) => await changeUsername(e)}>
        <input
          data-testid="userNameUpdateInput"
          id="userNameUpdateInput"
          type="text"
          value={newUserName}
          onChange={(e) => {
            setNewUserName(e.target.value);
          }}
        ></input>

        <button id="userNameUpdateSubmitButton" type="submit">
          Submit Username
        </button>
      </form>
      <div>
        <p>Hello {userCredentials?.userName}!</p>
        <p id="lblParsnips">Parsnips: {userData?.parsnipBalance}</p>
        <p id="lblPPC">{userData?.parsnipsPerClick} Parsnips Per Click (PPC)</p>
      </div>
    </div>
  );
}
