// Đánh dấu đây là Client Component
"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const router = useRouter();

   
      
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
        };
      
        const handleSubmit = async (e) => {
            e.preventDefault();
        
            try {
                const response = await axios.post('http://localhost:3000/users/contact', formData);
                alert(response.data.message); // Hiển thị thông báo thành công
                router.push('/'); // Chuyển hướng về trang chủ
            } catch (error) {
                console.error('Lỗi gửi yêu cầu:', error.response || error);
                alert('Đã xảy ra lỗi khi gửi yêu cầu.');
            }
        };
        
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Liên Hệ Với Chúng Tôi</h1>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Họ và Tên</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Nhập họ và tên"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Tin Nhắn</label>
                            <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                rows="5"
                                placeholder="Nhập tin nhắn của bạn"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Gửi</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
