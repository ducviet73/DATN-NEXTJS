"use client";
import * as Yup from "yup";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { registerSuccess, registerFailure } from '../../../redux/slices/authSlice'; // Ensure path is correct
import "../../../../public/bootstrap/css/haha.css";
import { useFormik } from "formik";
import { useRouter } from 'next/navigation';

const Register = () => {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.auth.error); 
    const router = useRouter();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(registerFailure(null)); 
            }, 5000); 
            return () => clearTimeout(timer); 
        }
    }, [error, dispatch]);

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:3000/users/register', values);
    
            if (response.status === 200) {
                dispatch(registerSuccess(response.data));
                alert(response.data.message);
                router.push('/login'); 
                throw new Error('Đăng ký thất bại');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký.';
            dispatch(registerFailure(errorMessage));
            alert(errorMessage); 
        }
    };
    
    const validationSchema = Yup.object({
        username: Yup.string().required("Tên người dùng là bắt buộc"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Email là bắt buộc"),
        password: Yup.string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .required("Mật khẩu là bắt buộc")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                "Mật khẩu phải chứa ít nhất một chữ hoa, thường và số"
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Mật khẩu xác nhận không khớp")
            .required("Xác nhận mật khẩu là bắt buộc"),
        phone: Yup.string()
            .matches(/^(0\d{9})?$/, "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 ký tự hoặc có thể bỏ trống"),
        address: Yup.string().required("Địa chỉ là bắt buộc"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            address: "",
        },
        validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    return (
        <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-lg">
                    <div className="card-body p-5">
                        <h1 className="text-center mb-4 fw-bold text-primary">Đăng Ký</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-label text-center d-block">
                                <label htmlFor="username" className="form-label">Tên người dùng</label>
                                <input
                                    type="text"
                                    className={`form-control ${formik.errors.username ? 'is-invalid' : ''}`}
                                    id="username"
                                    placeholder="Nhập tên người dùng"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.username && <div className="invalid-feedback">{formik.errors.username}</div>}
                            </div>
    
                            <div className="form-label text-center d-block">
                                <label htmlFor="email" className="form-label">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    placeholder="Nhập email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
                            </div>
    
                            <div className="form-label text-center d-block">
                                <label htmlFor="password" className="form-label">Mật khẩu</label>
                                <input
                                    type="password"
                                    className={`form-control ${formik.errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    placeholder="Mật khẩu"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
                            </div>
    
                            <div className="form-label text-center d-block">
                                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    className={`form-control ${formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    placeholder="Xác nhận mật khẩu"
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.confirmPassword && <div className="invalid-feedback">{formik.errors.confirmPassword}</div>}
                            </div>
    
                            <div className="form-label text-center d-block">
                                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className={`form-control ${formik.errors.phone ? 'is-invalid' : ''}`}
                                    id="phone"
                                    placeholder="Nhập số điện thoại"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.phone && <div className="invalid-feedback">{formik.errors.phone}</div>}
                            </div>
    
                            <div className="form-label text-center d-block">
                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    className={`form-control ${formik.errors.address ? 'is-invalid' : ''}`}
                                    id="address"
                                    placeholder="Nhập địa chỉ"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.address && <div className="invalid-feedback">{formik.errors.address}</div>}
                            </div>
    
                            <div className="text-center">
                                <button className="btn btn-primary w-100" type="submit">
                                    Đăng Ký
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    );
};

export default Register;
