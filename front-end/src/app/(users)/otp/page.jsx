
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../../../redux/slices/authSlice';

const VerifyOtpPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:3000/users/verify-otp', { email, otp });
            if (data.token && data.user) {
                // Lưu thông tin người dùng vào Redux
                dispatch(loginSuccess(data));

                // Kiểm tra vai trò của người dùng và điều hướng
                if (data.user.role === 'admin') {
                    router.push('/admin'); // Điều hướng đến trang admin
                } else {
                    router.push('/'); // Điều hướng đến trang chủ
                }
            }
        } catch (error) {
            alert('Lỗi xác thực OTP. Vui lòng thử lại.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="card p-4 shadow" style={{ maxWidth: '360px' }}>
                <h4 className="text-center mb-3">Xác thực OTP</h4>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="form-control mb-3"
                        required
                    />
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Mã OTP"
                        className="form-control mb-3"
                        required
                    />
                    <button className="btn btn-primary w-100" type="submit">Xác thực</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
