// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');

router.get('/profile/:userId', getUserProfile);

module.exports = router;
