import React, { useState } from 'react';
import axios, { AxiosStatic } from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UserData, userCursor } from '../../Models/Api';
import { baseUrl } from '../../App';
import Home from '../Home';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

test('"powerup1" should be on screen', async () => {
    mockedAxios.get.mockImplementation(async (url:String) => {
        switch(url) {
            case baseUrl+"userCredentials": {
                return Promise.resolve({
                    status: 200,
                    data: {
                        id: "0",
                        userName: "username",
                        email: "user@mail.com",
                        password: "password"
                    }
                });
            }
            case baseUrl+"userData": {
                return Promise.resolve({
                    status: 200,
                    data: {
                        id: "name",
                        credentialsId: "000",
                        parsnipsPerClick: "10",
                        parsnipsPerSecond: 3,
                        parsnipBalance: 15,
                        powerupsActivePurchased: [],
                        powerupsPassivePurchased: [],
                        cursor: userCursor.boxingGlove,
                        lifetimeClicks: 30,
                        lifetimeParsnipsEarned: 42,
                        lifetimeParsnipsSpent: 42
                    }
                });
            }
            case baseUrl+"powerUpPassive": {
                return Promise.resolve({
                    status: 200,
                    data: [
                        {id: "id1",
                        powerupName: "powerup1",
                        basePrice: 10,
                        increment: 0.15,
                        parsnipsPerSecond: 1,
                        priceForUser: 10}
                    ]
                });
            }
        }
    })

    render(<Home></Home>);
    expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl+"userData");
    expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl+"powerUpPassive");
    await waitFor(() => {
        expect(screen.getByText(/powerup1/)).toBeInTheDocument();
    })
})

test('Buying a powerup should send a post request for id', async () => {
    mockedAxios.get.mockImplementation(async (url:String) => {
        switch(url) {
            case baseUrl+"userCredentials": {
                return Promise.resolve({
                    status: 200,
                    data: {
                        id: "0",
                        userName: "username",
                        email: "user@mail.com",
                        password: "password"
                    }
                });
            }
            case baseUrl+"userData": {
                return Promise.resolve({
                    status: 200,
                    data: {
                        id: "name",
                        credentialsId: "000",
                        parsnipsPerClick: "10",
                        parsnipsPerSecond: 3,
                        parsnipBalance: 15,
                        powerupsActivePurchased: [],
                        powerupsPassivePurchased: [],
                        cursor: userCursor.boxingGlove,
                        lifetimeClicks: 30,
                        lifetimeParsnipsEarned: 42,
                        lifetimeParsnipsSpent: 42
                    }
                });
            }
            case baseUrl+"powerUpPassive": {
                return Promise.resolve({
                    status: 200,
                    data: [
                        {id: "id1",
                        powerupName: "powerup1",
                        basePrice: 10,
                        increment: 0.15,
                        parsnipsPerSecond: 1,
                        priceForUser: 10}
                    ]
                });
            }
        }
    })
    mockedAxios.post.mockImplementation(async (url:String, obj:any) => {
        return Promise.resolve({
            status: 200,
            data: "Successfully purchased the product"
        })
    })

    render(<Home></Home>);
    await waitFor(() => {
        const b1 = screen.getByText(/Buy Powerup/);
        b1.click()
    })
    expect(mockedAxios.post).toHaveBeenCalledWith(
        baseUrl+"userData/purchasePassivePowerUp",
        {powerupPassiveId: "id1"});
})