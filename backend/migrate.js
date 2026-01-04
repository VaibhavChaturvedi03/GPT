// Migration script to handle existing threads without userId
// Run this ONCE after setting up authentication if you have existing data

import mongoose from "mongoose";
import "dotenv/config";
import Thread from "./models/Thread.js";
import User from "./models/User.js";

const migrateExistingThreads = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        // Option 1: Delete all existing threads (if you don't need old data)
        // Uncomment the following lines to delete all threads:
        // const result = await Thread.deleteMany({});
        // console.log(`Deleted ${result.deletedCount} threads`);

        // Option 2: Assign all existing threads to a test user
        // First, create a test user or get an existing user
        const testUser = await User.findOne({}); // Get the first user
        
        if (!testUser) {
            console.log("No users found. Please login with Google first to create a user.");
            process.exit(0);
        }

        // Update all threads without userId to belong to the test user
        const result = await Thread.updateMany(
            { userId: { $exists: false } },
            { $set: { userId: testUser._id } }
        );

        console.log(`Updated ${result.modifiedCount} threads to belong to user: ${testUser.name}`);
        console.log("Migration complete!");

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        mongoose.connection.close();
    }
};

migrateExistingThreads();
