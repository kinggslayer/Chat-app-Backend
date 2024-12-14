const express = require('express');
const router = express.Router();

// Define your route logic here
router.get('/', async (req, res) => {
    res.status(200).send("Request was successful");
});

module.exports = router;

