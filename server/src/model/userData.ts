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

    // Stats
    lifetimeClicks: number;
    lifetimeParsnipsEarned: number;
    lifetimeParsnipsSpent: number;
    // TODO add all statistics
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

export interface LeaderboardQuery {
    sortBy: leaderboardSortBy
    limit?: number
}