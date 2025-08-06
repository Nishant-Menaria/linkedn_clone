import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


const Post = ({ post }) => {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://linkedn-clone.onrender.com/api/posts/${post._id}/comments`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    };

    fetchComments();

    if (Array.isArray(likes) && user?._id) {
      setIsLiked(likes.includes(user._id));
    }
  }, [post._id, likes, user]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`https://linkedn-clone.onrender.com/api/posts/${post._id}/like`);
      const updatedLikes = res.data.likes;
  
      setLikes(updatedLikes);
  
      if (user && user._id) {
        setIsLiked(updatedLikes.includes(user._id));
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`https://linkedn-clone.onrender.com/api/posts/${post._id}/comment`, {
        text: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`https://linkedn-clone.onrender.com/api/posts/${post._id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditedText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const res = await axios.put(`https://linkedn-clone.onrender.com/api/posts/${post._id}/comments/${commentId}`, {
        text: editedText,
      });
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, text: res.data.comment.text } : c
        )
      );
      setEditingCommentId(null);
      setEditedText("");
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mt-1">
  By{" "}
  <Link
    to={`/profile/${post.author?._id}`}
    className="text-blue-600 hover:underline"
  >
    {post.author?.name}
  </Link>
</p>

      {/* Like and Comment Count */}
      <div className="flex gap-4 mt-4 items-center">
      <button
          onClick={handleLike}
          className={`text-sm font-medium ${isLiked ? "text-blue-600" : "text-gray-600"}`}
        >
          {isLiked ? "❤️" : "🤍"} {likes.length} Likes
      </button>
        <span className="text-gray-500 text-sm">{comments.length} Comments</span>
      </div>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border rounded px-3 py-2 text-sm"
            placeholder="Write a comment..."
          />
          <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-2 rounded">
            Post
          </button>
        </form>
      )}

      {/* Comments Section */}
      {Array.isArray(comments) && comments.length > 0 && (
        <div className="mt-4 space-y-3">
          {(showAllComments ? comments : comments.slice(0, 2)).map((comment) => (
            <div
              key={comment._id}
              className="flex justify-between items-start bg-gray-50 p-2 rounded"
            >
              <div className="text-sm w-full">
                <span className="font-semibold text-gray-800">{comment.user?.name || "Unknown"}</span>
                {": "}
                {editingCommentId === comment._id ? (
                  <input
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="border px-2 py-1 rounded w-full mt-1 text-sm"
                  />
                ) : (
                  <span className="text-gray-700">{comment.text}</span>
                )}
              </div>

              {/* Edit/Delete Buttons */}
              {comment.user?._id === user?._id && (
                <div className="ml-2 flex flex-col sm:flex-row items-center gap-1 text-sm">
                  {editingCommentId === comment._id ? (
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(comment)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Show More / Less */}
          {comments.length > 2 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showAllComments ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
