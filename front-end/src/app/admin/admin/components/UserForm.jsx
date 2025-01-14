"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ userId, onUserUpdated }) => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'user',
    });
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [updating, setUpdating] = useState(false); // Trạng thái cập nhật

    // Lấy thông tin người dùng nếu `userId` tồn tại (chế độ chỉnh sửa)
    useEffect(() => {
        if (userId) {
            setLoading(true); // Bắt đầu loading
            axios
                .get(`http://localhost:3000/users/${userId}`)
                .then(response => {
                    setUser(response.data);
                    setLoading(false); // Dừng loading
                })
                .catch(error => {
                    console.error("Có lỗi xảy ra khi tải dữ liệu người dùng:", error);
                    setLoading(false); // Dừng loading
                });
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUpdating(true); // Bắt đầu cập nhật

        const request = userId
            ? axios.put(`http://localhost:3000/users/${userId}`, user) // Cập nhật người dùng
            : axios.post('http://localhost:3000/users', user); // Thêm mới người dùng

        request
            .then((response) => {
                onUserUpdated(response.data); // Cập nhật người dùng và thông báo thành công
                alert(userId ? 'Cập nhật thành công!' : 'Thêm người dùng thành công!');
            })
            .catch((error) => {
                console.error("Có lỗi xảy ra khi cập nhật người dùng:", error);
                alert('Đã xảy ra lỗi. Vui lòng kiểm tra lại thông tin!');
            })
            .finally(() => {
                setUpdating(false); // Dừng cập nhật
            });
    };

    // Hiển thị trạng thái loading khi dữ liệu người dùng đang được tải
    if (loading) {
        return <p>Đang tải thông tin người dùng...</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={user.username}  // Đảm bảo giá trị là chính xác
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={user.password}
                    onChange={handleChange}
                    placeholder={userId ? "Để trống nếu không muốn đổi mật khẩu" : ""}
                />
            </div>
            <div className="form-group">
                <label>Phone</label>
                <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={user.phone}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={user.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Role</label>
                <select
                    name="role"
                    className="form-control"
                    value={user.role}
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={updating} // Vô hiệu hóa nút khi đang cập nhật
            >
                {updating ? 'Đang lưu...' : 'Lưu'}
            </button>
        </form>
    );
};

export default UserForm;
