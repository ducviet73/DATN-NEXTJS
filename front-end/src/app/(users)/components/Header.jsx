"use client";
import Link from "next/link";
import Banner from "./Banner.js";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { logout } from "../../../redux/slices/authSlice";
import Category from "../category/page.jsx";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Header = () => {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [showCartPreview, setShowCartPreview] = useState(true);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };
    const cartItems = useSelector(state => state.cart.items) || [];
    const uniqueProductIds = new Set(cartItems.map(item => item._id));

    // Đếm số lượng các sản phẩm duy nhất
    const cartCount = uniqueProductIds.size;

    return (
        <div>
            <header className="position-relative bg-white border">
                <div className="bg-black d-none d-sm-block">
                    <div className="container text-white">
                        <div className="row">
                            <div className="col-md-6 pt-3">
                                <p className="text-white fs-8">
                                    <img
                                        src="https://file.hstatic.net/1000402464/file/output-onlinegiftools_9bbbf15c266044699bca3a5635e05246.gif"
                                        width="30px"
                                        alt=""
                                    />{" "}
                                    Nền tảng đấu giá hàng đầu Việt Nam
                                </p>
                            </div>
                            <div className="col-md-6 pt-1 d-flex align-items-end justify-content-end">
                                <p className="fs-8">
                                    <i className="bi bi-telephone-fill me"></i> HOTLINE: 0987654321{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container p-2 d-flex justify-content-between align-items-center">
                    <div>
                        <img src="/img/logo.jpg" className="d-block w-50" alt="..." />
                    </div>
                    <nav className="navbar navbar-expand-lg bg-white p-2 d-flex flex-column">
                        <div className="container px-0 mx-0">
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarTogglerDemo01"
                                aria-controls="navbarTogglerDemo01"
                                aria-expanded="false"
aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-uppercase">
                                    <li className="nav-item">
                                        <Link className="nav-link text-black" href="/">
                                            Trang chủ
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link text-black" href="/about">
                                            Giới thiệu
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            href="/products"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Sản phẩm
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <a className="dropdown-item" href="/products">
                                                    Tất cả sản phẩm
                                                </a>
                                            </li>
                                            <Category />
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-black" href="/blog">Tin tức</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-black" href="/contact">Liên hệ </a>
                                    </li>
                                </ul>
                            </div>
                            <form className="d-flex ms-4" action="/search">
                                <input
                                    className="form-control me-2"
                                    name="keyword"
                                    placeholder="Nhập tên sản phẩm"
                                />
<button className="btn btn-outline-success" type="submit">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div>
                    </nav>
                    <div className="d-flex align-items-center ms-5">
                        <div
                            id="cart"
                            className="position-relative d-flex justify-content-center align-items-center rounded-circle bg-black bg-opacity-10 px-2 py-1"
                            onMouseEnter={() => setShowCartPreview(true)}
                            onMouseLeave={() => setShowCartPreview(false)}
                        >
                            <Link href="/cart">
                                <i className="bi bi-cart fs-5 fw-bolder text-dark" />
                            </Link>
                            <div className="">
                                <span
                                    id="amount-cart"
                                    className="text-white position-absolute top-0 start-75 translate-middle bg-success px-2 rounded-circle"
                                >
                                    {cartCount}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        id="account"
                        className="d-flex justify-content-center align-items-center rounded-circle bg-black bg-opacity-10 mx-2 px-2 py-1"
                    >
                        <li className="nav-item dropdown taikhoan-icon">
                            <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-circle fs-5 fw-bolder text-dark" />
                                <span>{user ? `${user.username}` : "Tài khoản"}</span>
                            </a>
                            <ul className="dropdown-menu">
                                {!user ? (
                                    <>
                                        <li><a className="dropdown-item" href="/register">Đăng ký</a></li>
                                        <li><a className="dropdown-item" href="/login">Đăng nhập</a></li>
                                    </>
                                ) : (
                                    <>
                                        <li><a className="dropdown-item" href="/profile">Trang cá nhân</a></li>
                                        <li><a className="dropdown-item" href="/orders">Lịch sử đơn hàng</a></li>

                                        <li>
                                            <button className="btn btn-outline-secondary" onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right"></i> Thoát
                                            </button>
                                        </li>
</>
                                )}
                            </ul>
                        </li>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;