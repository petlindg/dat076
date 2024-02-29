export interface PowerupActive {
    id: string;
    powerupName: string;
    basePrice: number;
    increment: number;
    parsnipsPerClick: number;
    priceForUser: number;
}


export interface PowerupPassive {
    id: string;
    powerupName: string;
    basePrice: number;
    increment: number;
    parsnipsPerSecond: number;
    priceForUser: number;
}

interface UserPurchases {
    idPowerup: string;
    purchaseCount: number;
}

export interface UserData {
    id: string;
    credentialsId: string;
    parsnipsPerClick: number;
    parsnipsPerSecond: number;
    parsnipBalance: number;
    powerupsActivePurchased: UserPurchases[];
    powerupsPassivePurchased: UserPurchases[];
    lifetimeClicks: number;
    lifetimeParsnipsEarned: number;
    lifetimeParsnipsSpent: number;
}

export interface UserCredentials {
    id: string;
    userName: String;
    email: String;
    password: String;
}

export interface UserStatistics {
    idUserCredentials: string;
    parsnipsPerClick: number;
    parsnipsPerSecond: number;
    parsnipBalance: number;
    totalPowerupsPurchased: number;
    lifetimeClicks: number;
    lifetimeParsnipsEarned: number;
    lifetimeParsnipsSpent: number;
}
export interface UserLeaderboard {
    idUserCredentials: string;
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
