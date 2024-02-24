import {IAuthService} from "../service/interfaces/auth.interface";
import {AuthService} from "../service/auth";
import express, {Router, Request, Response} from "express";
import {LoginModel, RegisterModel} from "../model/auth";
import {StringHelpers} from "../helpers/stringHelpers";
import {EmailHelpers} from "../helpers/emailHelpers";
import {ObjectId} from "mongodb";

const authService: IAuthService = new AuthService()

export const authRouter: Router = express.Router()

authRouter.post("/register", async (req: Request<{}, {}, RegisterModel>, res: Response<string>) => {
    if (StringHelpers.isNullOrEmpty(req.body.username) || StringHelpers.isNullOrEmpty(req.body.password) || !EmailHelpers.validateEmail(req.body.email)) {
        res.status(400).send("Invalid credentials");
        return
    }

    if (req.session.user && req.session.user.id) {
        res.status(403).send("Already logged in, can not register another account, logout first")
        return
    }

    try {
        const userId: ObjectId = await authService.register(req.body)
        req.session.user = {
            id: userId
        }
        res.status(201).send("Successfully registered")
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})

authRouter.post("/login", async (req: Request<{}, {}, LoginModel>, res: Response<string>) => {
    if (StringHelpers.isNullOrEmpty(req.body.password) || !EmailHelpers.validateEmail(req.body.email)) {
        res.status(400).send("Invalid credentials");
        return
    }

    try {
        const userId: ObjectId = await authService.login(req.body)
        req.session.user = {
            id: userId
        }
        res.status(200).send("Successfully logged in")
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})

authRouter.delete("/logout", async (req: Request<{}, {}, {}>, res: Response<string>) => {
    try {
        req.session.destroy(() => {
        })
        // res.redirect("/account")
        res.status(200).send("Successfully logged out")
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})

authRouter.get("", async (req: Request<{}, {}, {}>, res: Response<string>) => {
    try {
        if (!req.session.user) {
            res.status(401).send("Not logged in")
            return
        }

        res.status(200).send(req.session.user.id.toString())
    } catch (error: any) {
        res.status(500).send(error.message ?? error)
    }
})
