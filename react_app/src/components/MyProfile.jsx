import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const MyProfile = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const resetSearch = () => {
    setSearch("");
  };

  useEffect(() => {
    const url = 'http://localhost:8000/myprofile/' + localStorage.getItem('userId');
    axios
      .get(url)
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          setNewUsername(res.data.user.username); // Initialize username
        }
      })
      .catch(() => {
        alert("Server error occurred");
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const url = 'http://localhost:8000/myprofile/update/' + localStorage.getItem('userId');
    axios
      .put(url, { username: newUsername })
      .then((res) => {
        if (res.data.success) {
          setUser({ ...user, username: newUsername });
          
          // Update the username in localStorage
          localStorage.setItem('username', newUsername);
  
          alert("Username updated successfully!");
          setIsEditing(false);
        } else {
          alert("Failed to update username");
        }
      })
      .catch(() => {
        alert("Server error occurred");
      });
  };
  

  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername(user.username); // Reset to original username
  };

  return (
    <>
      <Navbar search={search} resetSearch={resetSearch} />
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        <p className="text-gray-500 mt-2">Manage your personal information and contact details.</p>

        {user && (
          <div className="mt-8 bg-white shadow-md rounded-lg w-full max-w-md p-6">
            <div className="text-center mb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full mx-auto"
              />
              <h3 className="text-2xl font-semibold text-gray-800 mt-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="border rounded px-2 py-1 w-full max-w-xs text-center"
                  />
                ) : (
                  user.username
                )}
              </h3>
              {isEditing ? (
                <div className="mt-2 flex justify-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Username
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-600">Phone Number:</span>
                <span className="text-gray-800">{user.mobile}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyProfile;
