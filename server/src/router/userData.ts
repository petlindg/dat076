import {ObjectId} from "mongodb";
import {UserDataService} from "../service/userData";
import {IUserDataService} from "../service/interfaces/IuserData";
import express, {Request, Response, Router} from "express";
import {UserData} from "../model/userData";
import {isValidObjectId} from "mongoose";

const userDataService: IUserDataService = new UserDataService()

const userId = new ObjectId("65d75e0b5df275c5654b67a3"); // TODO get form cookies

export const userDataRouter: Router = express.Router();

userDataRouter.get("/", async (_, res: Response<UserData | string>) => {
    try {
        const userData: UserData = await userDataService.getUserData(userId)

        res.status(200).send(userData)
    } catch (e: any) {
        res.status(500).send(e)
    }
})

userDataRouter.post("/incrementParsnip", async (_, res: Response<string>) => {
    try {
        const newBalance: number = await userDataService.incrementParsnip(userId)

        res.status(200).send(newBalance.toString())
    } catch (e: any) {
        res.status(500).send(e)
    }
})

userDataRouter.post("/purchaseActivePowerUp", async (
    req: Request<{}, {}, { powerupActiveId: string }>,
    res: Response<string>
) => {
    try {
        if(!isValidObjectId(req.body.powerupActiveId))
        {
            res.status(400).send("Invalid ObjectId")
            return
        }

        const powerupId: ObjectId = new ObjectId(req.body.powerupActiveId)

        const success: boolean = await userDataService.purchasePowerupActive(userId, powerupId)

        if (!success) {
            res.status(403).send("Could not purchase the powerup, not enough balance")
            return
        }

        res.status(200).send("Successfully purchased the product")
    } catch (e: any) {
        res.status(500).send(e)
    }
})
