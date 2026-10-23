require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db");
const mongoose = require("mongoose");
const Contact = require("./models/Contact");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
app.use(cors({origin: ["http://127.0.0.1:5500", "http://localhost:5500" ]}));
const PORT = 3000;
app.use(express.json());
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");


function validateContact(name,email,phone,tags = []){
    if(
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof phone !== "string" ||
        name.trim() === "" ||
        email.trim() === "" ||
        phone.trim() === ""
    )
    {
        return "Name, email and phone number are required.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){
        return "Please provide a valid email address.";
    }

    const phonePattern = /^\+?[0-9]{10,15}$/;

    if(!phonePattern.test(phone.trim())){
        return "Please provide a valid phone number (10–15 digits, optionally starting with +).";
    }

    if (
        !Array.isArray(tags) ||
        !tags.every(tag => typeof tag === "string")
    ) {
        return "Tags must be an array of strings.";
    }

    return null;
}

app.post("/api/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate the input
        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            username.trim() === "" ||
            password === ""
        ) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        // Find the user in MongoDB
        const user = await User.findOne({
            username: username.trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Compare the entered password with the stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Send the token and user details to the frontend
        return res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                username: user.username,
                role: user.role
            }
        });

    } 
    catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Something went wrong during login."
        });
    }
});

app.post("/api/contacts", authMiddleware, roleMiddleware("Editor"),async (req,res) => {

    try {
        const {name, email,phone,tags } = req.body;

        const validationError = validateContact(name, email, phone,tags);

        if (validationError) {
            return res.status(400).json({message: validationError});
        }

        const newContact = await Contact.create({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            tags: tags || []
        });

        res.status(201).json({
            message: "Contact created successfully!",
            contact: newContact
        });

    } 
    catch (error) {
        console.error("Error creating contact:", error.message);

        res.status(500).json({
        message: "Failed to create contact."
        });
    }
});

app.put("/api/contacts/:id", authMiddleware, roleMiddleware("Editor"),async (req,res) => {

    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid contact ID."
            });
        }
        const {name, email, phone, tags} = req.body;

        const validationError = validateContact(name,email,phone,tags);

        if(validationError)
        {
            return res.status(400).json({
               message: validationError 
            });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                tags: tags || []
            },
            {
                new: true,
                runValidators: true

            }
        );

        if(!updatedContact){
            return res.status(404).json({
                message: "Contact not found."
            })
        }

        res.status(200).json({
            message: "Contact updated successfully",
            contact: updatedContact

        });
    }
    catch(error) {
        console.error("Error updating contact:",error.message);

        res.status(500).json({
            message: "Failed to update contact."
        });
    }
    
});

app.delete("/api/contacts/:id", authMiddleware, roleMiddleware("Editor"), async (req,res) => {

    try {

        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid contact ID."
            });
        }
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({
                message: "Contact not found."
            });
        }

        res.status(200).json({
            message: "Contact deleted successfully!",
            contact: deletedContact
        });

    } 
    catch (error) {
        console.error("Error deleting contact:", error.message);

        res.status(500).json({
            message: "Failed to delete contact."
        });
    }
});

app.get("/api/contacts", authMiddleware, async (req,res) => {

    try{

        const { search, tag, sortBy, order } = req.query;

        // Build the MongoDB filter
        const filter = {};

        // 1. Search by name, email, or phone
        if (search && search.trim() !== "") {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const searchRegex = new RegExp(escapedSearch, "i");

            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ];
        }

        // 2. Filter by tag
        if (tag && tag !== "all") {
            filter.tags = tag;
        }

        // 3. Sort contacts
        const allowedFields = ["name", "createdAt", "phone"];

        const field = allowedFields.includes(sortBy)
            ? sortBy
            : "name";

        const direction = order === "desc" ? -1 : 1;

        const contacts = await Contact.find(filter)
            .sort({ [field]: direction });

        if (contacts.length === 0) {
            return res.status(200).json({
                message: "No contacts found matching your search criteria.",
                contact: []
            });
        }

        res.status(200).json({
            message: "Contacts retrieved successfully",
            contact: contacts
        });

    } 
    catch (error) {
        console.error("Error retrieving contacts:", error.message);

        res.status(500).json({
            message: "Failed to retrieve contacts."
        });
    }

});

app.get("/api/contacts/:id", authMiddleware, async(req,res) => {
    try{
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid contact ID."
            });
        }
        const contact = await Contact.findById(id);

        if(!contact) {
            return res.status(404).json({
                message: "Contact not found."
            });
        }
        res.status(200).json({
            message: "Contact retrieved successfully",
            contact: contact
        });
    }
    catch(error){
        console.error("Error retrieving contact:",error.message);
        
        res.status(500).json({
            message: "Failed to retrieve contact."
        });
    }
});

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();
