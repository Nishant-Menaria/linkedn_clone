// controllers/userController.js
const User = require('../models/User');
const Post = require('../models/Post');

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('username bio');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: userId }).populate('author', 'username');

    res.status(200).json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
