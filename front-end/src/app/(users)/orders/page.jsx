"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderHistory from '../components/lichsudonhang';
import { useSelector, useDispatch } from 'react-redux';

const OrderHistorys = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);  // State lưu thông tin đơn hàng khi nhấn

  useEffect(() => {
    // Fetch orders from the API
    axios
      .get(`https://star-backend-z1cm.onrender.com/orders/lichsu/${userId}`)
      .then((response) => {
        setOrders(response.data);  // Assuming the API returns an array of orders
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching orders');
        setLoading(false);
      });
  }, [userId]);

  // Function to handle showing order details
  const showOrderDetails = (order) => {
    setSelectedOrder(order);  // Lưu đơn hàng đã chọn vào state
  };
  const user = useSelector(state => state.auth.user);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await fetch(`https://star-backend-z1cm.onrender.com/orders/status/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        
        const data = await response.json();
        if (response.ok) {
            alert('Trạng thái đơn hàng đã được cập nhật');
            // Cập nhật lại trạng thái đơn hàng trong state nếu cần
            setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
        } else {
            alert(data.message || 'Lỗi cập nhật trạng thái');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Đã có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      {user && user._id && <OrderHistory userId={user._id} />}

      

      
    </div>
  );
};

export default OrderHistorys;