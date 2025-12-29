import express from 'express';
import "dotenv/config";
import mongoose from "mongoose";
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(express.json()); //to parse incoming req
app.use(cors());

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    }catch(err){
        console.log("MongoDB failed to connect");
        console.log(err);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});






