import {IPowerupPassiveService} from "../service/interfaces/powerupPassive.interface";
import {PowerupPassiveService} from "../service/powerupPassive";
import express, {Request, Response, Router} from "express";
import {PowerupPassiveResponseModel} from "../model/powerupPassiveResponseModel";
import {ObjectId} from "mongodb";

const powerupPassiveService: IPowerupPassiveService = new PowerupPassiveService()

export const powerupPassiveRouter: Router = express.Router()

powerupPassiveRouter.get("", async (req: Request<{}, {}, {}>, res: Response<PowerupPassiveResponseModel[] | string>) => {
    try {

        const userId: ObjectId = req.session.user!.id
        const powerupsPassive: PowerupPassiveResponseModel[] = await powerupPassiveService.getPowerupPassiveList(userId)

        res.status(200).send(powerupsPassive)
    } catch (error: any) {
        res.status(error.statusCode ?? 500).send(error.message ?? error)
    }
})
