import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

mongoose.set('strictQuery', false);
const URI = process.env.MONGO_URI;

mongoose.connect( URI , (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Conectado a Base de Datos');
    }
})