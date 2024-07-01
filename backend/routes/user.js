const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db"); 
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

// Creating zod validation schema
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

// zod validation schema for signin 
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

// zod validation schema for update user details
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

// signup route 
router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body); // We are checking whether the inputs are validated by zod
    if (!success) {
        return res.status(400).json({
            msg: "Invalid inputs",
        });
    }

    // We are checking if username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json({
            msg: "Email already exists",
        });
    }

    // If username not present already, create a new user with the details filled by user
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    const userId = newUser._id; // By default this is the userid format in mongodb

    // After signup, give a random balance to user (for demonstration purposes)
    await Account.create({
        userId: userId,
        balance: (1 + Math.random() * 10000),
    });

    // After creating new user credentials, provide them the JSON web token
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    // Success response in JSON format
    res.json({
        msg: "User created successfully",
        token: token,
    });
});

// signin route
router.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(body); // Zod validation for signin credentials by user
    if (!success) {
        return res.status(400).json({
            msg: "Incorrect inputs"
        });
    }

    // Check if username and password exist in database
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    // If user found in database, assign them a token 
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.status(200).json({
            token: token
        });
    } else {
        // If user not found, respond with invalid credentials
        res.status(400).json({
            msg: "Invalid credentials"
        });
    }
});

// Update user details route
router.put("/", authMiddleware, async (req, res) => {
    const body = req.body;
    const { success } = updateSchema.safeParse(body);
    if (!success) {
        return res.status(400).json({
            msg: "Error while updating"
        });
    }

    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
        msg: "Updated successfully",
    });
});

// Endpoint to search users by filter (firstName or lastName)
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
                "$options": "i" // Case insensitive
            }
        }, {
            lastName: {
                "$regex": filter,
                "$options": "i" // Case insensitive
            }
        }]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;
