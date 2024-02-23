import {ObjectId} from "mongodb";
import {UserDataService} from "../service/userData";
import {IUserDataService} from "../service/interfaces/userData.interface";
import express, {Request, Response, Router} from "express";
import {UserData, UserStatistics} from "../model/userData";
import {objectIdHelpers} from "../helpers/objecIdHelpers";

const userDataService: IUserDataService = new UserDataService()

const userId = new ObjectId("65d75e0b5df275c5654b67a3"); // TODO get form cookies

export const userDataRouter: Router = express.Router();

userDataRouter.get("/", async (req, res: Response<UserData | string>) => {
    try {

        if (!req.session.user) {
            res.status(401).send("Not logged in")
            return
        }
        const userId: ObjectId = req.session.user.id

        const userData: UserData = await userDataService.getUserData(userId)

        res.status(200).send(userData)
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})

userDataRouter.post("/incrementParsnip", async (req, res: Response<string>) => {
    try {

        if (!req.session.user) {
            res.status(401).send("Not logged in")
            return
        }
        const userId: ObjectId = req.session.user.id

        const newBalance: number = await userDataService.incrementParsnip(userId)

        res.status(200).send(newBalance.toString())
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})

userDataRouter.post("/purchaseActivePowerUp", async (
    req: Request<{}, {}, { powerupActiveId: string }>,
    res: Response<string>
) => {
    try {

        if (!req.session.user) {
            res.status(401).send("Not logged in")
            return
        }
        const userId: ObjectId = req.session.user.id

        if (!objectIdHelpers.isStringValidObjectId(req.body.powerupActiveId)) {
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
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})

userDataRouter.get("/statistics", async (req, res: Response<UserStatistics | string>) => {
    try {

        if (!req.session.user) {
            res.status(401).send("Not logged in")
            return
        }
        const userId: ObjectId = req.session.user.id

        const userStatistics: UserStatistics = await userDataService.getUserStatistic(userId)

        res.status(200).send(userStatistics)
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})
