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

        // @ts-ignore
        const userId: ObjectId | null = socket.request.session.user.id

        if (!userId)
            return

        socket.on('parsnipClick', async () => {
            const newBalance: number = await userDataService.incrementParsnip(userId)
            socket.emit("parsnipBalance", newBalance)
        });
    });
}