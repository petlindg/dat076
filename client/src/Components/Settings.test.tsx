import React from 'react';
import { Settings } from './Settings';
import axios, { AxiosStatic } from 'axios';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

test('"Change cursor" should be on the screen', async () => {
    render(<Settings></Settings>)
    expect(screen.getByText(/Change cursor/)).toBeInTheDocument();
})

test('Changing the cursor should send a post request to change cursor', async () => {
    mockedAxios.post.mockResolvedValue({
        status: 200,
        data: "Cursor successfully updated"
    })
    render(<Settings></Settings>)
    const b1 = screen.getByText(/Cursor/);
    await fireEvent.click(b1)
    const b2 = screen.getByText(/bat/);
    await fireEvent.click(b2)
    expect(mockedAxios.post).toHaveBeenCalled()
})

test('"Change username" should be on the screen', async () => {
    render(<Settings></Settings>)
    expect(screen.getByText(/Change username/)).toBeInTheDocument();
})

test('Changing username should patch a new username', async () => {
    mockedAxios.patch.mockResolvedValue({
        status: 200,
        data: "Successfully updated username"
    })

    render(<Settings></Settings>)
    const inputField: HTMLInputElement = screen.getByTestId('userNameUpdateInput')
    fireEvent.change(inputField, {target: {value: "newName"}})
    const b1 = screen.getByText(/Submit Username/)
    b1.click()
    expect(mockedAxios.patch).toHaveBeenCalled()
})

test('Changing username with no input shouldnt patch username', async () => {
    mockedAxios.patch.mockResolvedValue({
        status: 200,
        data: "Successfully updated username"
    })

    render(<Settings></Settings>)
    const inputField: HTMLInputElement = screen.getByTestId('userNameUpdateInput')
    fireEvent.change(inputField, {target: {value: ""}})
    const b1 = screen.getByText(/Submit Username/)
    b1.click()
    expect(mockedAxios.patch).toHaveBeenCalledTimes(0)
})