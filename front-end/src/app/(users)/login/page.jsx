'use client';

import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "../../../../public/bootstrap/css/haha.css";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [currentForm, setCurrentForm] = useState("user"); 
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState(""); 
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = async (data) => {
        try {
            const endpoint = "http://localhost:3000/users/login"; // Endpoint đăng nhập
    
            const response = await axios.post(endpoint, {
                email: data.email,
                password: data.password,
                isAdmin: currentForm === "admin", 
            });
                if (response.data.otpSent) { 
                router.push('/otp'); 
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
            setError(errorMessage);
        }
    };
    

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post("http://localhost:3000/users/forgot-password", { email });
            if (response.data) {
                alert("Link reset mật khẩu đã được gửi vào email của bạn!");
                setShowForgotPassword(false);
            }
        } catch {
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <>     

            <div className="container d-flex flex-column align-items-center mt-5">
                <div className="mb-4">
                    <button
                        className={`btn ${currentForm === "user" ? "btn-primary" : "btn-outline-primary"} me-2`}
                        onClick={() => setCurrentForm("user")}
                    >
                        Đăng nhập Người dùng
                    </button>
                    <button
                        className={`btn ${currentForm === "admin" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setCurrentForm("admin")}
                    >
                        Đăng nhập quản trị viên
                    </button>
                </div>
                {currentForm === "user" && (
                    <div className="card p-4 shadow" style={{ maxWidth: "360px", width: "100%" }}>
                        <h3 className="text-center mb-3">Đăng nhập người dùng</h3>
                        <form onSubmit={handleSubmit((data) => handleLogin(data))}>
                            <input
                                className="form-control mb-3"
                                type="email"
                                placeholder="Email"
                                {...register("email", { required: "Email không được để trống" })}
                            />
                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            <input
                                className="form-control mb-3"
                                type="password"
                                placeholder="Mật khẩu"
                                {...register("password", { required: "Mật khẩu không được để trống" })}
                            />
                            {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            <a
                                href="#"
                                className="text-decoration-none d-block mb-3"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Quên mật khẩu?
                            </a>
                            <button className="btn btn-primary w-100" type="submit">Đăng nhập</button>
                            {error && <p className="text-danger mt-3">{error}</p>}
                        </form>
                    </div>
                )}
                {currentForm === "admin" && (
                    <div className="card p-4 shadow" style={{ maxWidth: "360px", width: "100%" }}>
                        <h3 className="text-center mb-3">Đăng nhập quản trị viên</h3>
                        <form onSubmit={handleSubmit((data) => handleLogin(data))}>
                            <input
                                className="form-control mb-3"
                                type="email"
                                placeholder="Email Admin"
                                {...register("email", { required: "Email không được để trống" })}
                            />
                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            <input
                                className="form-control mb-3"
                                type="password"
                                placeholder="Mật khẩu Admin"
                                {...register("password", { required: "Mật khẩu không được để trống" })}
                            />
                            {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            <a
                                href="#"
                                className="text-decoration-none d-block mb-3"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Quên mật khẩu?
                            </a>
                            <button className="btn btn-primary w-100" type="submit">Đăng nhập</button>
                            {error && <p className="text-danger mt-3">{error}</p>}
                        </form>
                    </div>
                )}
                {showForgotPassword && (
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Quên mật khẩu?</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowForgotPassword(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <label className="form-label">Nhập email của bạn</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowForgotPassword(false)}
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleForgotPassword}
                                    >
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
export default Login;
