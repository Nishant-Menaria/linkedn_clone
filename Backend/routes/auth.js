const express = require('express');
const { register, login} = require('../controllers/authController.js');
const User = require('../models/User.js');
const {verifyToken} = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

router.get('/me', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      console.log(user);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });


  

module.exports = router;
