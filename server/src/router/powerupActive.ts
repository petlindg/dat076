import {ObjectId} from "mongodb";
import {IpowerupActiveService} from "../service/interfaces/IpowerupActive";
import {PowerupActiveService} from "../service/powerupActive";
import express, {Request, Response, Router} from "express";
import {PowerupActiveResponseModel} from "../model/powerupActiveResponseModel";

const powerupActiveService: IpowerupActiveService = new PowerupActiveService()
const userId: ObjectId = new ObjectId("65d75e0b5df275c5654b67a3"); // TODO get form cookies

export const powerupActiveRouter: Router = express.Router();

powerupActiveRouter.get("", async (_: Request<{}, {}, {}>, res: Response<PowerupActiveResponseModel[] | string>): Promise<void> => {
    try {
        const powerupsActive: PowerupActiveResponseModel[] = await powerupActiveService.getPowerupActiveList(userId)

        res.status(200).send(powerupsActive)
    } catch (error: any) {
        res.status(500).send(error.message);
    }

})
