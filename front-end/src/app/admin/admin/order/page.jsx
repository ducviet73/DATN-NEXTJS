"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const QuanLyDonHangAdmin = () => {
  const [donHangs, setDonHangs] = useState([]);
  const [donHangChon, setDonHangChon] = useState(null);
  const [trangThai, setTrangThai] = useState("");
  const [ngay, setNgay] = useState("");
  const [thuNhapTong, setThuNhapTong] = useState(0);
  const [donHangsLoc, setDonHangsLoc] = useState([]);
  const [loi, setLoi] = useState("");
  const [dangTai, setDangTai] = useState(true);

  // Lấy dữ liệu đơn hàng và thu nhập tổng khi trang được tải
  useEffect(() => {
    const layDonHangs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        setDonHangs(response.data);
        setDonHangsLoc(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        setLoi("Không thể lấy dữ liệu đơn hàng");
      } finally {
        setDangTai(false);
      }
    };

    const layThuNhapTong = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders/incomes/total");
        setThuNhapTong(response.data.total);
      } catch (error) {
        console.error("Lỗi khi lấy thu nhập tổng:", error);
        setLoi("Không thể lấy thu nhập tổng");
      }
    };

    layDonHangs();
    layThuNhapTong();
  }, []);

  // Cập nhật trạng thái đơn hàng
  const handleThayDoiTrangThai = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Phản hồi mạng không hợp lệ: ${response.status}`);
      }

      const updatedOrder = await response.json();
      setDonHangs(donHangs.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      setLoi(`Không thể cập nhật trạng thái: ${error.message}`);
    }
  };

  // Xóa đơn hàng
  const handleXoaDonHang = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        await axios.delete(`http://localhost:3000/orders/${orderId}`);
        setDonHangs(donHangs.filter((order) => order._id !== orderId));
        if (donHangChon && donHangChon._id === orderId) {
          setDonHangChon(null);
        }
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        setLoi("Không thể xóa đơn hàng");
      }
    }
  };

  // Lọc đơn hàng theo trạng thái
  const handleLocTheoTrangThai = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/orders/status/${trangThai}`);
      setDonHangsLoc(response.data);
    } catch (error) {
      console.error("Lỗi khi lọc đơn hàng theo trạng thái:", error);
      setLoi("Không thể lọc đơn hàng theo trạng thái");
    }
  };

  // Lọc đơn hàng theo ngày
  const handleLocTheoNgay = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/orders/date/${ngay}`);
      setDonHangsLoc(response.data);
    } catch (error) {
      console.error("Lỗi khi lọc đơn hàng theo ngày:", error);
      setLoi("Không thể lọc đơn hàng theo ngày");
    }
  };

  // Hiển thị loading khi đang tải
  if (dangTai)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Quản Lý Đơn Hàng</h1>
      {loi && <div className="alert alert-danger">{loi}</div>}

      {/* Phần Thu Nhập Tổng */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h2>Thu Nhập Tổng</h2>
              <p className="h4">{thuNhapTong.toLocaleString()} đ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Lọc Đơn Hàng */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h3>Lọc Đơn Hàng</h3>
          <div className="mb-3">
            <select
              className="form-select"
              value={trangThai}
              onChange={(e) => setTrangThai(e.target.value)}
            >
              <option value="">Chọn Trạng Thái</option>
              <option value="Chờ xử lý">Đang Chờ</option>
              <option value="Đang xử lý">Đang Xử Lý</option>
              <option value="Đã giao hàng">Đã Gửi</option>
              <option value="Đã nhận hàng">Đã Giao</option>
              <option value="Đã hủy">Đã Hủy</option>
            </select>
            <button className="btn btn-primary mt-2" onClick={handleLocTheoTrangThai}>
              Lọc theo Trạng Thái
            </button>
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={ngay}
              onChange={(e) => setNgay(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={handleLocTheoNgay}>
              Lọc theo Ngày
            </button>
          </div>
        </div>
      </div>

      {/* Bảng Đơn Hàng */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tổng Tiền</th>
              <th>Địa Chỉ Giao Hàng</th>
              <th>Phương Thức Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Cập Nhật Trạng Thái</th>
              <th>Chi Tiết</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {donHangsLoc.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.totalAmount.toFixed(2)} đ</td>
                <td>
                  {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
                </td>
                <td>{order.paymentMethod}</td>
                <td>{order.status}</td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => handleThayDoiTrangThai(order._id, e.target.value)}
                  >
                     <option value="">Chọn Trạng Thái</option>
              <option value="Chờ xử lý">Đang Chờ</option>
              <option value="Đang xử lý">Đang Xử Lý</option>
              <option value="Đã giao hàng">Đã Gửi</option>
              <option value="Đã nhận hàng">Đã Giao</option>
              <option value="Đã hủy">Đã Hủy</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-info" onClick={() => setDonHangChon(order)}>
                    Xem Chi Tiết
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleXoaDonHang(order._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Chi Tiết Đơn Hàng */}
      {donHangChon && (
        <div className="mt-4">
          <h2>Chi Tiết Đơn Hàng</h2>
          <ul>
            {donHangChon.details.map((product) => (
              <li key={product._id}>
                <strong>Tên Sản Phẩm:</strong> {product.name} <br />
                <strong>Số Lượng:</strong> {product.quantity} <br />
                <strong>Giá:</strong> {product.price.toLocaleString()} đ
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuanLyDonHangAdmin;
