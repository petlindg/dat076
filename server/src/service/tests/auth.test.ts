import {userCredentialsModel} from "../../db/userCredentials.db";
import {userDataModel} from "../../db/userData.db";
import {describe} from "node:test";
import {IAuthService} from "../interfaces/auth.interface";
import {AuthService} from "../auth";
import {ObjectId} from "mongodb";
import {UserCredentials} from "../../model/userCredentials";
import bcrypt from "bcryptjs";
import {UserData} from "../../model/userData";

jest.mock("../../db/conn")
afterEach(async (): Promise<void> => {
    await (await userCredentialsModel).deleteMany()
    await (await userDataModel).deleteMany()
})

const authService: IAuthService = new AuthService()

const username: string = "TheTestGuy"
const mail: string = "thetestguy@jest.com"
const password: string = "besterJester123"

describe("Auth service test", () => {

    let saveOneId : ObjectId | null = null

    it("When a user is registered, a new user with its data should be in the db. Should fail if duplicate email", async () => {
        const userId: ObjectId = await authService.register({
            username: username,
            email: mail,
            password: password
        })

        const userCredentials: UserCredentials | null = await (await userCredentialsModel).findById(userId)

        expect(userCredentials).toBeDefined()
        expect(userCredentials?.id).toEqual(userId)
        expect(userCredentials?.userName).toEqual(username)
        expect(userCredentials?.email).toEqual(mail)
        expect(bcrypt.compareSync(password, userCredentials!.password)).toBeTruthy()

        const userData: UserData | null = await (await userDataModel).findOne({credentialsId: userId})

        expect(userData).toBeDefined()
        expect(userData?.parsnipsPerClick).toEqual(1)
        expect(userData?.parsnipBalance).toEqual(0)
        expect(userData?.powerupsActivePurchased).toEqual([])
        expect(userData?.powerupsPassivePurchased).toEqual([])
        expect(userData?.lifetimeClicks).toEqual(0)
        expect(userData?.lifetimeParsnipsEarned).toEqual(0)
        expect(userData?.lifetimeParsnipsSpent).toEqual(0)

        await expect(authService.register({
            username: username,
            email: mail,
            password: password
        })).rejects.toThrow()
    })

    it("Login should return the correct userId, if the credentials match", async () => {
        const userIdRegister: ObjectId = await authService.register({
            username: username,
            email: mail,
            password: password
        })
        saveOneId = userIdRegister

        await expect(authService.login({
            email: "some@email.com",
            password: password
        })).rejects.toThrow()

        await expect(authService.login({
            email: mail,
            password: "YAY"
        })).rejects.toThrow()

        const userIdLogin: ObjectId = await authService.login({
            email: mail,
            password: password
        })

        expect(userIdLogin.toString()).toEqual(userIdRegister.toString())
    })


    it("After registering or logging in isLoggedIn should return true", async () => {

        if(saveOneId !== null)
            expect(await authService.isLoggedIn(saveOneId)).toBeFalsy()


        const userIdRegister: ObjectId = await authService.register({
            username: username,
            email: mail,
            password: password
        })

        expect(await authService.isLoggedIn(userIdRegister)).toBeTruthy()
    })
})