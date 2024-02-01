import express, { Request, Response, Router } from "express";
import { User } from "../model/user";
import { UserService } from "../service/user";

const userService : UserService = new UserService();

export const userRouter : Router = express.Router();

userRouter.get("/", async (
    req : Request<{}, {}, {}>,
    res : Response<User | string>
) => {
        try {
            const user : User = await userService.getUser()
            res.status(200).send(user)
        } catch (e : any) {
            res.status(500).send(e.message);
        }
})

userRouter.get("/parsnipCount", async (
    req : Request<{}, {}, {}>,
    res : Response<string>
) => {
        try {
            const parsnipCount : number = await userService.getParsnips()
            console.log(parsnipCount);
            res.status(200).send(parsnipCount.toString())
        } catch (e : any) {
            res.status(500).send(e.message);
        }
})

userRouter.post("/", async (
    req: Request<{}, {}, {}>,
    res: Response<string>,
) => {
    try {
        const totalParsnips : number = await userService.incParsnip();
        res.status(200).send(totalParsnips.toString());
    } catch (e: any) {
        console.log(e)
        res.status(500).send(e.message);
    }
})

userRouter.patch("/", async (
    req : Request<{}, {}, {}>, 
    res : Response<string>
) => {
        try {
            const purchased : boolean = await userService.buyPowerUp()
            
            if (purchased)
                res.status(200).send("Successfully purchased a powerup")
            else
                res.status(403).send("Could not purchase powerup, not enough parsnip")
            
        } catch (e: any) {
            res.status(500).send(e.message);
        }
})
