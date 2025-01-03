
"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const UpdateOrderStatus = () => {
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:3000/orders/${orderId}/status`, { status });
            setMessage('Trạng thái đơn hàng đã được cập nhật.');
        } catch (err) {
            setMessage('Lỗi khi cập nhật trạng thái đơn hàng.');
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formOrderId">
                    <Form.Label>ID Đơn Hàng</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập ID đơn hàng"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formStatus">
                    <Form.Label>Trạng Thái</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập trạng thái"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Cập Nhật
                </Button>
            </Form>
            {message && <Alert variant={message.includes('Lỗi') ? 'danger' : 'success'}>{message}</Alert>}
        </div>
    );
};

export default UpdateOrderStatus;
