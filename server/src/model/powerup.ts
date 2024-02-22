import { ObjectId } from "mongodb";

export interface Powerup {
  id: ObjectId;
  powerupName: String;
  basePrice: number;
  increment: number;
}
