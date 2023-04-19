import mongoose from "mongoose";
import { dev } from "./parameterConfiguration";

export const createDatabaseConnection = async() =>{
    try {
        await mongoose.connect(dev.db.url)
        console.log("Database is connected")
    } catch (error) {
        console.log(error)
    }
}