import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../public/bootstrap/css/orders.css'
const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);  // State lưu thông tin đơn hàng khi nhấn

  useEffect(() => {
    // Fetch orders from the API
    axios
      .get(`http://localhost:3000/orders/history/${userId}`)
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await fetch(`http://localhost:3000/orders/status/${orderId}`, {
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
      <h2 className="mb-4">Lịch Sử Đơn Hàng</h2>
      {selectedOrder && (
        <div className="mt-5 d-flex justify-content-center">
          <div className="card shadow-lg p-4" style={{ width: '80%', maxWidth: '800px' }}>
            <button
              className="btn btn-danger btn-sm position-absolute"
              style={{ top: '10px', right: '10px' }}
              onClick={() => setSelectedOrder(null)} // Gọi hàm setSelectedOrder để ẩn chi tiết đơn hàng
            >
              Tắt
            </button>
            <h3 className="text-center mb-4">Chi Tiết Đơn Hàng: {selectedOrder._id}</h3>
            <h4>Địa Chỉ Giao Hàng</h4>
            <p>
              {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
            </p>
      
            <h4>Chi Tiết Sản Phẩm</h4>
            <ul>
              {selectedOrder.details.map((item) => (
                <li key={item._id}>
                  <strong>Tên Sản Phẩm:</strong> {item.name}<br />
                  <strong>Số Lượng:</strong> {item.quantity}<br />
                  <strong>Giá:</strong> {item.price.toLocaleString('vi-VN')} đ
                </li>
              ))}
            </ul>

            <h4>Trạng Thái</h4>
            <p>{selectedOrder.status}</p>

            {/* Only show the "Hủy Đơn Hàng" button if the status is "Chờ Xác Nhận" */}
            {selectedOrder.status === 'pending' && (
              <button
                className="btn btn-danger ml-2"
                onClick={() => updateOrderStatus(selectedOrder._id, 'cancelled')}
              >
                Hủy Đơn Hàng
              </button>
            )}
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Ngày Tạo</th>
              <th>Tổng Tiền</th>
              <th>Phương Thức Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Địa Chỉ Giao Hàng</th>
              <th>Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.totalAmount.toLocaleString('vi-VN')} đ</td>
                <td>{order.paymentMethod}</td>
                <td>{order.status}</td>
                <td>
                  {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => showOrderDetails(order)} // Hiển thị chi tiết đơn hàng khi nhấn
                  >
                    Xem Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;