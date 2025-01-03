
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

const TotalIncome = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTotalIncome = async () => {
            try {
                const response = await axios.get('http://localhost:3000/orders/incomes/total');
                setTotalIncome(response.data.total);
            } catch (err) {
                setError('Không thể lấy tổng doanh thu.');
            }
        };
        fetchTotalIncome();
    }, []);

    return (
        <Card>
            <Card.Body>
                <Card.Title>Tổng Doanh Thu</Card.Title>
                <Card.Text>
                    {error ? <div className="text-danger">{error}</div> : `${totalIncome.toLocaleString()} VND`}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default TotalIncome;
