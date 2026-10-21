require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully!");

        const username = "testuser";
        const password = "Test@123";
        const role = "Editor";

        // Check whether this username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            console.log("This username already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword,
            role
        });

        console.log("Test user created successfully!");
        console.log("Username:", user.username);
        console.log("Role:", user.role);

    } 
    catch (error) {
        console.error("Error creating user:", error.message);
    } 
    finally {
        await mongoose.disconnect();
    }
}

createUser();