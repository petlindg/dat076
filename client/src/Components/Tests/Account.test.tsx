import axios, {AxiosStatic} from 'axios';
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import Account from "../Account";
import {useNavigate} from "react-router-dom";

jest.mock('axios');
jest.mock('react-router-dom', () => {
    const actualModule = jest.requireActual('react-router-dom');

    return {
        ...actualModule,
        useNavigate: jest.fn(),
    };
});
jest.spyOn(window, 'alert').mockImplementation(() => {});
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

test("Page should render properly", async () => {
    render(<Account isLoggedIn={false} setIsLoggedIn={() => {}}/>)
    expect(screen.getByText(/Account/)).toBeInTheDocument()
    expect(screen.getByText(/Username:/)).toBeInTheDocument()
})

test("Registering with empty credentials shouldn't send a post request to the api", async () => {
    let setIsLoggedInCalled: boolean = false
    render(<Account isLoggedIn={false} setIsLoggedIn={() => {setIsLoggedInCalled = true}}/>)


    const b1: HTMLElement = screen.getByRole('button', { name: /Register/ });
    fireEvent.click(b1)
    expect(mockedAxios.post).toHaveBeenCalledTimes(0)
    expect(setIsLoggedInCalled).toBeFalsy()
})

test("Logging in should call axios and the setIsLoggedIn function", async () => {
    mockedAxios.post.mockResolvedValue({
        status: 200,
        data: "Successfully updated username"
    })

    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => mockNavigate);

    const mockSetIsLoggedIn = jest.fn()
    render(<Account isLoggedIn={false} setIsLoggedIn={mockSetIsLoggedIn}/>)

    const inputMail: HTMLInputElement = screen.getByTestId("emailLoginInput")
    const inputPass: HTMLInputElement = screen.getByTestId("passwordLoginInput")
    const loginButton: HTMLElement = screen.getByRole('button', { name: /Login/ });
    fireEvent.change(inputMail, {target: {value: "test@email.com"}})
    fireEvent.change(inputPass, {target: {value: "weakPassword123"}})
    fireEvent.click(loginButton)
    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalled()
        expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true)
        expect(useNavigate()).toHaveBeenCalledWith("/")
    })
})



