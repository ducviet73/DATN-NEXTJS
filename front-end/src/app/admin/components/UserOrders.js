"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Alert } from 'react-bootstrap';

const UserOrders = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/orders/${userId}`);
                setOrders(response.data);
            } catch (err) {
                setError('Không tìm thấy đơn hàng.');
            }
        };
        fetchOrders();
    }, [userId]);

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Trạng thái</th>
                        <th>Số tiền</th>
                        <th>Ngày tạo</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.status}</td>
                            <td>{order.totalAmount}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserOrders;
