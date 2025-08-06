const express = require('express');
const router = express.Router();
const {verifyToken ,isOwner} = require('../middlewares/authMiddleware.js');
const {createPost,getAllPosts,toggleLikePost ,addComment,getUserProfile,getCommentsForPost ,editComment,deleteComment} = require('../controllers/postController');

// Create post
router.post('/', verifyToken, createPost);

// Get all posts (public feed)
router.get('/', getAllPosts);

// Like/unlike a post
router.put('/:postId/like', verifyToken, toggleLikePost);


router.get('/:postId/comments', getCommentsForPost);

// Add a comment
router.post('/:postId/comment', verifyToken,addComment);


// routes/userRoutes.js or routes/profileRoutes.js
router.get("/:userId/profile", getUserProfile);

router.put('/:postId/comments/:commentId', isOwner, editComment);

// Delete comment
router.delete('/:postId/comments/:commentId', isOwner, deleteComment);

module.exports = router;
