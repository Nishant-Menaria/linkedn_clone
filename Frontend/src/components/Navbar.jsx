import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async() => {
    localStorage.removeItem('user');
    await axios.post('https://linkedn-clone.onrender.com/logout', {}, {
      withCredentials: true
    });
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left: Logo and Search */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-blue-700 text-2xl font-bold">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            alt="LinkedIn"
            className="w-7 h-7"
          />
          <span>LinkedIn</span>
        </Link>
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 border rounded-md focus:outline-none"
        />
      </div>

      {/* Right: Auth Links or Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {!user ? (
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">Register</Link>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-semibold capitalize"
            >
              {user.name}
              <span className="text-sm">▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                <Link
                  to={`/profile/${user._id}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
