import { createConnection } from "mongoose";
const env = require("../env.json")

const URI:string = "mongodb+srv://dat076:<password>@parsnip-puncher.7shlst9.mongodb.net/?retryWrites=true&w=majority&appName=parsnip-puncher"

export const conn = createConnection(URI)