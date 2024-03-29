import {ObjectId} from "mongodb";

interface UserPurchases {
    idPowerup: ObjectId;
    purchaseCount: number;
}

export interface UserData {

    // Management
    id: ObjectId;
    credentialsId: ObjectId;

    // Gameplay
    parsnipsPerClick: number;
    parsnipBalance: number;
    parsnipsPerSecond: number;
    powerupsActivePurchased: UserPurchases[];
    powerupsPassivePurchased: UserPurchases[];
    cursor: userCursor;

    // Stats
    lifetimeClicks: number;
    lifetimeParsnipsEarned: number;
    lifetimeParsnipsSpent: number;
}

export interface UserStatistics {
    idUserCredentials: ObjectId;
    parsnipsPerClick: number;
    parsnipsPerSecond: number;
    parsnipBalance: number;
    totalPowerupsPurchased: number;
    lifetimeClicks: number;
    lifetimeParsnipsEarned: number;
    lifetimeParsnipsSpent: number;
}

export interface UserLeaderboard {
    idUserCredentials: ObjectId;
    username: string,
    place: number,
    parsnipsPerClick: number;
    parsnipsPerSecond: number;
    totalPowerupsPurchased: number;
    lifetimeClicks: number;
    lifetimeParsnipsEarned: number;
    lifetimeParsnipsSpent: number;
    sortedBy: leaderboardSortBy
}

export enum leaderboardSortBy {
    parsnipsPerClick = "parsnipsPerClick",
    parsnipsPerSecond = "parsnipsPerSecond",
    lifetimeClicks = "lifetimeClicks",
    lifetimeParsnipsEarned = "lifetimeParsnipsEarned",
    lifetimeParsnipsSpent = "lifetimeParsnipsSpent",
}

export enum userCursor {
    boxingGlove = "boxingGlove",
    bat = "bat",
    crowbar = "crowbar",
}

export interface LeaderboardQuery {
    sortBy: leaderboardSortBy
    limit?: number
}