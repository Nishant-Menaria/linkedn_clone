// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://linkedn-clone.onrender.com/api/user/profile/${userId}`);
        setUserInfo(res.data.user);
        setUserPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!userInfo) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold">{userInfo.username}</h2>
        <p className="text-gray-600">{userInfo.bio || "No bio available."}</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Posts by {userInfo.username}</h3>
      {userPosts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        userPosts.map((post) => (
          <div key={post._id} className="bg-white shadow-sm rounded-md p-4 mb-3 border">
            <p>{post.content}</p>
            <small className="text-gray-400">Posted on {new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
