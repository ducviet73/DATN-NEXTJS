"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserListWithRoleUpdate = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        admins: 0,
        regularUsers: 0,
    });
    const [showRoleUpdateForm, setShowRoleUpdateForm] = useState(false);
    const [updatingRoleUserId, setUpdatingRoleUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users');
                const userList = response.data;
                setUsers(userList);
                setUserStats({
                    totalUsers: userList.length,
                    admins: userList.filter(user => user.role === 'admin').length,
                    regularUsers: userList.filter(user => user.role === 'user').length,
                });
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleUpdateClick = (userId) => {
        setUpdatingRoleUserId(userId);
        setShowRoleUpdateForm(true);
    };

    const handleRoleUpdated = () => {
        setShowRoleUpdateForm(false);
        setUsers(prevUsers => [...prevUsers]);
    };

    const handleCloseRoleUpdateForm = () => {
        setShowRoleUpdateForm(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Quản Lý Người Dùng</h2>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h5 className="card-title">Tổng số người dùng</h5>
                            <p className="card-text fs-4">{userStats.totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h5 className="card-title">Quản trị viên</h5>
                            <p className="card-text fs-4">{userStats.admins}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-secondary">
                        <div className="card-body">
                            <h5 className="card-title">Người dùng bình thường</h5>
                            <p className="card-text fs-4">{userStats.regularUsers}</p>
                        </div>
                    </div>
                </div>
            </div>

            <table className="table table-bordered">
                <thead className="table-dark text-center">
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr key={user._id} className="text-center">
                            <td>{i + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                            <td>
                                <span className={`badge ${user.role === 'admin' ? 'bg-success' : 'bg-secondary'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <button className="btn btn-info btn-sm" onClick={() => handleRoleUpdateClick(user._id)}>
                                    <i className="fas fa-user-cog"></i> Cập nhật Role
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showRoleUpdateForm && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cập nhật Role</h5>
                                <button type="button" className="btn-close" onClick={handleCloseRoleUpdateForm}></button>
                            </div>
                            <div className="modal-body">
                                <RoleUpdateForm userId={updatingRoleUserId} onRoleUpdated={handleRoleUpdated} onClose={handleCloseRoleUpdateForm} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RoleUpdateForm = ({ userId, onRoleUpdated, onClose }) => {
    const [role, setRole] = useState('user');

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3000/users/${userId}`)
                .then(response => setRole(response.data.role))
                .catch(error => console.error("Có lỗi xảy ra:", error));
        }
    }, [userId]);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/users/${userId}`, { role })
            .then(() => {
                onRoleUpdated();
            })
            .catch(error => console.error("Có lỗi xảy ra:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Role</label>
                <select name="role" className="form-control" value={role} onChange={handleRoleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Update Role</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Cancel</button>
        </form>
    );
};

export default UserListWithRoleUpdate;
