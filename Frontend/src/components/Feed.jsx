import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post.jsx';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:5001/api/posts',
        { content: newPost ,
          user:user
        },
        { withCredentials: true }
      );
      setPosts([res.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      {/* Post creation section */}
      {user && (
        <form
          onSubmit={handlePost}
          className="bg-white shadow-md border w-2xl mx-auto rounded-xl p-4 flex flex-col gap-4"
        >
          <div className="flex gap-3 items-start">
            {/* User avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Textarea fills remaining width */}
            <div className="flex-1">
              <textarea
                rows="4"
                placeholder={`What's on your mind, ${user.name}?`}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {/* Post list */}
      {loading ? (
        <div className="text-center mt-6 text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts yet.</div>
      ) : (
        posts.map((post) =>(
          <Post key={post._id} post={post} />
        ))
      )}
    </div>
  );
};

export default Feed;
