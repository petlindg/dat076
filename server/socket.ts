import {sessionMiddleware} from "./src/start";
import {Socket} from "socket.io";
import {io} from "./src";
import {IUserDataService} from "./src/service/interfaces/userData.interface";
import {UserDataService} from "./src/service/userData";
import {ObjectId} from "mongodb";

const userDataService: IUserDataService = new UserDataService()

export function socketSetup() {
    io.engine.use(sessionMiddleware)
    io.on('connection', (socket: Socket) => {

        // @ts-ignore unfortunate that I have to use this, but I cannot get TS to understand socket sessions
        const userId: ObjectId | null = socket.request.session.user.id

        if (!userId)
            return

        socket.on('parsnipClick', async () => {
            const newBalance: number = await userDataService.incrementParsnip(userId)
            socket.emit("parsnipBalance", newBalance)
        });

        socket.on('parsnipPassive', async () => {
            const newBalance: number = await userDataService.incrementParsnipsPassive(userId)
            socket.emit("parsnipBalance", newBalance)
        })
    });
}