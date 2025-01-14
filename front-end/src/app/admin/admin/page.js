"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import useSWR from "swr";
import CharThongKe from "./components/charthongke";

export default function Dashboard() {
    const user = useSelector((state) => state.auth.user);
    const [orders, setOrders] = useState([]);
    const [customersCount, setCustomersCount] = useState(0);
    const [incomes, setIncomes] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch products count with SWR
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data: productData, error: productError } = useSWR(
        `http://localhost:3000/products/page?page=1&limit=5`,
        fetcher
    );

    useEffect(() => {
        // Fetch user-specific orders
        axios
            .get(`http://localhost:3000/orders`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                setErrorMessage("Lỗi khi lấy dữ liệu đơn hàng.");
                console.error("Error fetching order history:", error);
            });

        // Fetch customers count
        axios
            .get(`http://localhost:3000/users/count`)
            .then((response) => {
                setCustomersCount(response.data.count);
            })
            .catch((error) => {
                setErrorMessage("Lỗi khi lấy số lượng khách hàng.");
                console.error("Error fetching customers count:", error);
            });

        // Fetch total incomes
        axios
            .get(`http://localhost:3000/orders/incomes/total`)
            .then((response) => {
                setIncomes(response.data.total);
            })
            .catch((error) => {
                setErrorMessage("Lỗi khi lấy tổng doanh thu.");
                console.error("Error fetching incomes:", error);
            });
    }, []);

    const totalOrders = orders.length;
    const productsCount = productData?.countPro || 0;

    return (
        <>
            <div className="container">
                <div className="row mb-4">
                    <div className="col-12">
                        <h3 className="text-primary">Bảng Điều Khiển</h3>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card shadow-sm bg-primary text-white rounded-3">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h4>{totalOrders}</h4>
                                    <p className="mb-0">ĐƠN HÀNG</p>
                                </div>
                                <i className="fal fa-file-invoice-dollar fa-2x"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card shadow-sm bg-warning text-dark rounded-3">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h4>{productsCount}</h4>
                                    <p className="mb-0">SẢN PHẨM</p>
                                </div>
                                <i className="fal fa-boxes fa-2x"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card shadow-sm bg-danger text-white rounded-3">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h4>{customersCount}</h4>
                                    <p className="mb-0">KHÁCH HÀNG</p>
                                </div>
                                <i className="fal fa-users fa-2x"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card shadow-sm bg-success text-white rounded-3">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h4>{incomes.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</h4>
                                    <p className="mb-0">DOANH THU</p>
                                </div>
                                <i className="fal fa-chart-line fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                                    <h6 className="mb-0">
                                        <i className="fal fa-file-invoice-dollar fa-lg"></i> Đơn Hàng Gần Đây
                                    </h6>
                                    <small>
                                        <a href="#" className="text-decoration-none">Tất cả Đơn Hàng</a>
                                    </small>
                                </div>
                                {orders.slice(0, 3).map(order => (
                                    <div key={order._id} className="d-flex text-body-secondary pt-3">
                                        <div className={`p-2 me-2 ${order.status === 'pending' ? 'bg-warning' : order.status === 'completed' ? 'bg-success' : 'bg-danger'} text-white`}>
                                            <i className="fal fa-receipt"></i>
                                        </div>
                                        <a href="#" className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary">
                                            <strong className="d-flex justify-content-between">
                                                Đơn #{order._id}
                                                <div>
                                                    <span className="badge text-bg-warning">
                                                        <i className="far fa-box"></i> {order.details.reduce((sum, item) => sum + item.quantity, 0)}
                                                    </span>
                                                    <span className="badge bg-success-subtle text-success">
                                                        <i className="far fa-money-bill-wave"></i> {order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </span>
                                                </div>
                                            </strong>
                                            Đặt bởi <i>{user?.name || 'Khách vãng lai'}</i> lúc {new Date(order.createdAt).toLocaleString()}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                                    <h6 className="mb-0">
                                        <i className="fal fa-stars fa-lg"></i> Recent Ratings
                                    </h6>
                                    <small>
                                        <a href="#" className="text-decoration-none">All Ratings</a>
                                    </small>
                                </div>
                                <div className="d-flex text-body-secondary pt-3">
                                    <i className="far fa-comment-alt-smile"></i>
                                    <a href="#" className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary">
                                        <strong className="d-flex justify-content-between">
                                            iPhone 15 Pro Max 256GB Gold Rose
                                            <div className="text-warning">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star-half-alt"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                        </strong>
                                        Đánh giá bởi <i>Nguyễn Văn A</i> vào 13/12/2024
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                    <CharThongKe />
                    </div>
                </div>
            </div>
        </>
    );
}
