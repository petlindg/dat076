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
    parsnipBalance: number;
    totalPowerupsPurchased: number;
    lifetimeClicks: number;
    lifetimeParsnipEarned: number;
    lifetimeParsnipSpent: number;
}

