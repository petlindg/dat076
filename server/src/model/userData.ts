interface UserPurchases {
    idPowerup : Number;
    purchaseCount : Number;
}

export interface UserData {
    id : number;
    credentialsId : number;
    parsnipsPerClick : number;
    parsnipBalance : number;
    powerupsActivePurchased : UserPurchases[];
    powerupsPassivePurchased : UserPurchases[];
    // TODO add all statistics
}
