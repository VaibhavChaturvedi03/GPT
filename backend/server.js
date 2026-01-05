import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 8080;

app.set("trust proxy", 1);

const FRONTEND_URL = "https://gpt-pi-beige.vercel.app";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());

app.use(
  session({
    name: "gpt.sid", 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: true,               
      sameSite: "none"            
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
