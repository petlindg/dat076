import {ObjectId} from "mongodb";
import {StringHelpers} from "./stringHelpers";
export class objectIdHelpers{
    static isStringValidObjectId(s : string) : boolean{

        const b0 : boolean = !StringHelpers.isNullOrEmpty(s)
        const b1 :boolean = ObjectId.isValid(s)
        const b2 : boolean = (new ObjectId(s)).toString() === s;

        return b0 && b1 && b2
    }
}