// import { User } from "../model/userData";
//
// export class UserService {
//     private user: User = {
//         userId: Date.now(),
//         userName: "Anon",
//         parsnipsPerClick: 1,
//         parsnipCount: 0,
//     };
//
//     async incParsnip(): Promise<number> {
//         this.user.parsnipCount += this.user.parsnipsPerClick;
//
//         return this.user.parsnipCount;
//     }
//
//     async getParsnips(): Promise<number> {
//         return this.user.parsnipCount;
//     }
//
//     async updateUserName(userName: string): Promise<string> {
//         this.user.userName = userName;
//         return userName;
//     }
//
// // TODO - these should be moved to a new service one we have the DB
//     async buyPowerUp(): Promise<boolean> {
//         // if user has more than 25 parsnips, buy powerup
//         if (this.user.parsnipCount >= 25) {
//             this.user.parsnipsPerClick += 1;
//             this.user.parsnipCount -= 25;
//             return true;
//         }
//         return false;
//     }
//
//     async getUser(): Promise<User> {
//         return JSON.parse(JSON.stringify(this.user));
//     }
// }
//