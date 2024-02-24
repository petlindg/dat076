import {NextFunction, Request, Response} from 'express';
import {UserCredentials} from "../model/userCredentials";
import {userCredentialsModel} from "../db/userCredentials.db";

/**
 * This function ensures valid login
 * It should be applied to all endpoint via app.use(authMiddleware) in start.ts
 * If you are sure the function is applied to a route you may use req.session.user! there
 * @param req
 * @param res
 * @param next
 */
async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    if (req.originalUrl.startsWith("/auth"))
        return next()

    if (!req.session.user || !req.session.user.id)
        return res.status(401).send("Not logged in, you must be logged in to perform this action")

    const userCredentials: UserCredentials | null = await (await userCredentialsModel).findById(req.session.user.id)

    if (!userCredentials) {
        req.session.destroy(() => {})
        return res.status(401).send("Invalid or expired login, please login to perform this action")
    }

    return next()
}

export {authMiddleware}