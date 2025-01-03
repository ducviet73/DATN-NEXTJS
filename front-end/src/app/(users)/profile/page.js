"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    avatar: null // Added avatar as part of formData
  });

  const token = localStorage.getItem('token') || ''; // Token lưu trữ trong localStorage
  const user = useSelector(state => state.auth.user); // Accessing user from Redux store

  // Fetch user data when component mounts or token changes
  useEffect(() => {
    if (token && user) {
      // Get user data from API using the token
      axios.get(`http://localhost:3000/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUserData(response.data); // Set fetched data to state
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [token, user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle avatar file input change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      avatar: file // Store the file object in state
    });
  };

  // Update user profile on form submit
  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // Prepare form data to send (including avatar if present)
    const updatedData = new FormData();
    updatedData.append('username', formData.username || userData.username);
    updatedData.append('email', formData.email || userData.email);
    updatedData.append('phone', formData.phone || userData.phone);
    updatedData.append('address', formData.address || userData.address);

    if (formData.avatar) {
      updatedData.append('avatar', formData.avatar); // Append avatar file if it exists
    }

    // Send PUT request to update user data
    axios.put(`http://localhost:3000/users/${user._id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // Specify that it's a file upload
      }
    })
      .then(response => {
        setUserData(response.data); // Update local state with the response data
        setIsEditing(false); // Close the edit form
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Profile</h2>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <img
                src={userData.avatar || 'default-avatar.jpg'}
                alt="User Avatar"
                className="img-fluid rounded-circle"
                style={{ width: '150px', height: '150px' }} // Optional styling for avatar
              />
            </div>
            <div className="col-md-8">
              <h4>{userData.username}</h4>
              <p>Email: {userData.email}</p>
              <p>Phone: {userData.phone}</p>
              <p>Address: {userData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form to edit user profile */}
      {isEditing && (
        <div>
          <h4>Edit Profile</h4>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username || userData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email || userData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone || userData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address || userData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Avatar file input */}
            <div className="mb-3">
              <label className="form-label">Avatar</label>
              <input
                type="file"
                className="form-control"
                onChange={handleAvatarChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">Update</button>
          </form>
        </div>
      )}

      {/* Button to toggle edit mode */}
      {!isEditing && (
        <button
          className="btn btn-secondary mt-4"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default Profile;
