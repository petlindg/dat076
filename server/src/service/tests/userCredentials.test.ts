import {describe} from "node:test";
import {UserCredentials} from "../../model/userCredentials";
import {userCredentialsModel} from "../../db/userCredentials.db";
import {IUserCredentialsService} from "../interfaces/userCredentials.interface";
import {UserCredentialsService} from "../userCredentials";
import {ObjectId} from "mongodb";

afterEach(async (): Promise<void> => {
    await (await userCredentialsModel).deleteMany()
})

jest.mock("../../db/conn")
const userCredentialsService: IUserCredentialsService = new UserCredentialsService()
describe("User Credentials Service tests", () => {

    const userName: string = "TestUserName";
    const email: string = "noumailcist@email.com";
    const password: string = "plzencodeme";

    it("Creating User Credentials with mongoose works as expected", async () => {
        const userCredentials: UserCredentials = await (await userCredentialsModel).create({
            userName: userName,
            email: email,
            password: password,
        })

        expect(userCredentials.id).toBeDefined()
        expect(userCredentials.userName).toEqual(userName)
        expect(userCredentials.email).toEqual(email)
        expect(userCredentials.password).toEqual(password)
    })

    it("Getting User Credentials, will return correct credentials", async () => {
        const userId: ObjectId = (await (await userCredentialsModel).create({
            userName: userName,
            email: email,
            password: password,
        }))._id

        await expect(userCredentialsService.getUserCredentials(new ObjectId("65d8947a15e5748f2ed42b99"))).rejects.toThrow()

        const userCredentials: UserCredentials = await userCredentialsService.getUserCredentials(userId)

        expect(userCredentials.userName).toEqual(userName)
        expect(userCredentials.email).toEqual(email)
        expect(userCredentials.password).toEqual(password)
    })

    it("Updating a user's username, should result in the username being updated", async () => {
        const userCredentials: UserCredentials = await (await userCredentialsModel).create({
            userName: userName,
            email: email,
            password: password,
        })

        const newUsername: string = "kosobrin"
        await expect(userCredentialsService.changeUsername(new ObjectId("65d8947a15e5748f2ed42b99"), newUsername)).rejects.toThrow()
        await expect(userCredentialsService.changeUsername(userCredentials.id, "")).rejects.toThrow()
        const success: boolean = await userCredentialsService.changeUsername(userCredentials.id, newUsername)

        expect(success).toBeTruthy()

        const userCredentials2: UserCredentials = await userCredentialsService.getUserCredentials(userCredentials.id)
        expect(userCredentials2.userName).toEqual(newUsername)
        expect(userCredentials2.email).toEqual(email)
        expect(userCredentials2.password).toEqual(password)
    })

})