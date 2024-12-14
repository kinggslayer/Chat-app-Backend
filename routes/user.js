const express = require("express");
const { MongoClient } = require("mongodb");
const User = require('../models/User');
const router = express.Router();
// MongoDB connection string
const uri ="mongodb://localhost:27017";
const client = new MongoClient(uri);

router.get("/", async (req, res) => {
    try {
        await client.connect();
        const database = client.db("test"); // Your database name
        const collection = database.collection("users"); // Your collection name

        // Fetch usernames and avatars
        const users = await collection.find({}, { projection: { username: 1, avatar: 1, _id: 0 } }).toArray();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    } finally {
        await client.close();
    }
});
module.exports = router;
