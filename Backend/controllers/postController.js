const Post = require('../models/Post.js');

// Create a post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      content: req.body.content,
      author: req.user.userId
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// Get all posts (public feed)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name bio') // show only author's name
      .sort({ createdAt: -1 }); 
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Like or Unlike a post
exports.toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.status(200).json({ message: alreadyLiked ? 'Unliked' : 'Liked' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to like/unlike post' });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user.userId,
      text: req.body.text
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};


// GET /api/users/:userId/profile
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user (exclude password)
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get user's posts
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar");

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post and populate comments' authors
    const post = await Post.findById(postId).populate({
      path: 'comments.user',
      select: 'name', // Include only the author's name
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.editComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.text = text;
    await post.save();

    res.status(200).json({ message: 'Comment updated', comment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findOne({ 'comments._id': commentId });

    if (!post) return res.status(404).json({ message: 'Post or comment not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Post.updateOne(
      { 'comments._id': commentId },
      { $pull: { comments: { _id: commentId } } }
    );

    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

