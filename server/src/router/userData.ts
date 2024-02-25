import {ObjectId} from "mongodb";
import {UserDataService} from "../service/userData";
import {IUserDataService} from "../service/interfaces/userData.interface";
import express, {Request, Response, Router} from "express";
import {LeaderboardQuery, leaderboardSortBy, UserData, UserLeaderboard, UserStatistics} from "../model/userData";
import {objectIdHelpers} from "../helpers/objecIdHelpers";
import {IncrementParsnipsResponseModel} from "../model/incrementParsnipsResponseModel";
import {type} from "node:os";

const userDataService: IUserDataService = new UserDataService()

export const userDataRouter: Router = express.Router();

userDataRouter.get("/", async (req, res: Response<UserData | string>) => {
    try {

        const userId: ObjectId = req.session.user!.id

        const userData: UserData = await userDataService.getUserData(userId)

        res.status(200).send(userData)
    } catch (error: any) {
        res.status(error.statusCode ?? 500).send(error.message ?? error)
    }
})

userDataRouter.post("/incrementParsnip", async (req, res: Response<IncrementParsnipsResponseModel>) => {
    try {

        const userId: ObjectId = req.session.user!.id

        const newBalance: number = await userDataService.incrementParsnip(userId)

        res.status(200).send({newParsnipBalance: newBalance})
    } catch (error: any) {
        res.status(error.statusCode ?? 500).send(error.message ?? error)
    }
})

userDataRouter.post("/purchaseActivePowerUp", async (
    req: Request<{}, {}, { powerupActiveId: string }>,
    res: Response<string>
) => {
    try {

        const userId: ObjectId = req.session.user!.id

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
        res.status(error.statusCode ?? 500).send(error.message ?? error)
    }
})

userDataRouter.get("/statistics", async (req, res: Response<UserStatistics | string>) => {
    try {

        const userId: ObjectId = req.session.user!.id

        const userStatistics: UserStatistics = await userDataService.getUserStatistic(userId)

        res.status(200).send(userStatistics)
    } catch (error: any) {
        res.status(error.statusCode ?? 500).send(error.message ?? error)
    }
})

userDataRouter.get("/leaderboard", async (req: Request<{}, {}, LeaderboardQuery>, res: Response<UserLeaderboard[] | string>) => {
    try {

        const limit: number = (req.query.limit === undefined) ? 20 : parseInt(req.query.limit as string)
        const sortBy: leaderboardSortBy = req.query.sortBy as leaderboardSortBy

        if(!Object.values(leaderboardSortBy).includes(sortBy) || isNaN(limit))
            return res.status(400).send("Invalid request query")

        const userLeaderboard : UserLeaderboard[] = await userDataService.getUserLeaderBoard(sortBy, limit)

        res.status(200).send(userLeaderboard)

    } catch (error: any) {
        res.status(error.statusCode ?? 500).send(error.message ?? error)
    }
})
