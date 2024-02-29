import {ObjectId} from "mongodb";
import {IPowerupActiveService} from "../service/interfaces/powerupActive.interface";
import {PowerupActiveService} from "../service/powerupActive";
import express, {Request, Response, Router} from "express";
import {PowerupActiveResponseModel} from "../model/powerupActiveResponseModel";

const powerupActiveService: IPowerupActiveService = new PowerupActiveService()

export const powerupActiveRouter: Router = express.Router();

powerupActiveRouter.get("", async (req: Request<{}, {}, {}>, res: Response<PowerupActiveResponseModel[] | string>): Promise<void> => {
    try {

        const userId: ObjectId = req.session.user!.id
        const powerupsActive: PowerupActiveResponseModel[] = await powerupActiveService.getPowerupActiveList(userId)

        res.status(200).send(powerupsActive)
    } catch (error: any) {
        res.status(error.statusCode ?? 500).send(error.message ?? error)
    }

})
