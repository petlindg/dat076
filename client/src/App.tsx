import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { AxiosResponse } from 'axios';

interface User {
  userId : number;
  userName : String;
  parsnipsPerClick : number
  parsnipCount : number
}

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const url : String = "http://localhost:8080/";
  
  async function updateUser() {
    try {
      const response = await axios.get<User>(url + "user");
      const newUser : User = response.data;
      setUser(newUser);
    } catch (e : any) {
      console.log(e);
    }
  }
  
  async function incrementParsnip() {
    try {
      await axios.post<User>(url + "user/punch", {});
      await updateUser();
    } catch (e : any) {
      console.log(e);
    }
  }

  async function purchasePowerup() {
    try {
      const response: AxiosResponse<String, any> = await axios.patch<String>(url + "user/powerUp", {});
      if(response.status === 403){
        alert("Not enoug balance for this purchase")
      }else if(response.status === 200){
        await updateUser();
      }else{
        alert("Unknown error occured")
      }
    } catch (e: any){
      alert("Not enoug balance for this purchase")
      console.log(e);
    }
  }

  useEffect(() => {
    document.title = 'Parsnip Puncher';
    updateUser();
  });

  return (
    <div>
      <div>
        <p id="lblParsnips">Parsnips: {user?.parsnipCount}</p>
        <div className="boxing-cursor parsnip-animation" onClick={incrementParsnip}>
          <img
            draggable="false"  
            alt='The main parsnip'
            src={ require('./assets/images/parsnip.png') }
          />
        </div>
      </div>
      <p id="lblPPC">{user?.parsnipsPerClick} Parsnips Per Click (PPC)</p>
      <button onClick={purchasePowerup}>
        Buy Powerup
      </button>
    </div>
  );
}

export default App;
