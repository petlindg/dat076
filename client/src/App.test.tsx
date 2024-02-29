import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';
import axios, {AxiosStatic} from 'axios';

const url: String = "http://localhost:8080/";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

test('"Parsnips:" should be on the screen', async () => {
    render(<App/>)
    expect(screen.getByText(/Buy Powerup/)).toBeInTheDocument();
    expect(screen.getByText(/Parsnips:/)).toBeInTheDocument();
})

test('After clicking the submit button axios should have been called', async () => {
    mockedAxios.patch.mockResolvedValue({
        status: 201,
        data: ""
    });

    render(<App/>)

    const button = screen.getByText(/Submit Username/)
    const inputField: HTMLInputElement = screen.getByTestId('userNameUpdateInput')
    fireEvent.change(inputField, {target: {value: "newName"}})
    expect(inputField.value).toEqual("newName")
    await fireEvent.click(button);
    expect(mockedAxios.patch).toHaveBeenCalled();
})