import express from 'express';
import "dotenv/config";
import mongoose from "mongoose";
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = 8080;

// CORS configuration to allow credentials
app.use(cors({
    origin:'https://gpt-pi-beige.vercel.app',
    credentials: true
}));

app.use(express.json()); //to parse incoming req

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: true, 
        sameSite: 'none'
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api',chatRoutes);

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






