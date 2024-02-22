import { ObjectId } from "mongodb";

interface UserPurchases {
  idPowerup: ObjectId;
  purchaseCount: Number;
}

export interface UserData {
  id: ObjectId;
  credentialsId: number;
  parsnipsPerClick: number;
  parsnipBalance: number;
  powerupsActivePurchased: UserPurchases[];
  powerupsPassivePurchased: UserPurchases[];
  // TODO add all statistics
}
