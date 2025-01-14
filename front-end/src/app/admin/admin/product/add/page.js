"use client";
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useSWR from 'swr';
import Link from 'next/link';

// Hàm Fetcher với xử lý lỗi
const fetcher = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text();
            console.error('Lỗi phản hồi:', text);
            throw new Error(`Lỗi HTTP! mã lỗi: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi fetch:', error);
        throw error;
    }
};

// Schema xác thực với Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[A-Z][a-z]*(?:[\s.,!?'-][A-Z][a-z]*)*$/, 'Tên phải bắt đầu bằng chữ cái viết hoa sau mỗi khoảng trắng và có thể chứa dấu câu')
        .required('Tên là bắt buộc'),
    category: Yup.string()
        .required('Danh mục là bắt buộc'),
    sale: Yup.number()
        .min(0, 'Khuyến mãi phải ít nhất là 0')
        .max(100, 'Khuyến mãi không được vượt quá 100')
        .required('Khuyến mãi là bắt buộc')
        .typeError('Khuyến mãi phải là số'),
    description: Yup.string()
        .matches(/^[\w\s.,!?]+$/, 'Mô tả chỉ có thể chứa chữ cái, số và dấu câu thông thường'),
    price: Yup.number()
        .min(0, 'Giá phải ít nhất là 0')
        .required('Giá là bắt buộc')
        .typeError('Giá phải là số'),
    content: Yup.string()
        .matches(/^[\w\s.,!?]+$/, 'Nội dung chỉ có thể chứa chữ cái, số và dấu câu thông thường'),
    view: Yup.number()
        .min(0, 'Số lượt xem phải ít nhất là 0')
        .typeError('Số lượt xem phải là số'),
    inventory: Yup.number()
        .min(0, 'Kho hàng phải ít nhất là 0')
        .required('Kho hàng là bắt buộc')
        .typeError('Kho hàng phải là số'),
    rating: Yup.number()
        .min(0, 'Đánh giá phải ít nhất là 0')
        .max(5, 'Đánh giá không được vượt quá 5')
        .typeError('Đánh giá phải là số'),
});

export default function ProductAdd() {
    // Lấy danh mục
    const { data: categories, error: categoriesError } = useSWR("http://localhost:3000/categories", fetcher);

    // Cấu hình Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            category: '',
            sale: '',
            description: '',
            price: '',
            content: '',
            view: '',
            inventory: '',
            rating: '',
            image: null,
            images: [],
        },
        validationSchema,
        onSubmit: async (values,{ resetForm }) => {
            const data = new FormData();
    
            // Thêm các trường không phải file vào FormData
            Object.keys(values).forEach(key => {
                if (values[key] !== '' && values[key] !== null && key !== 'image' && key !== 'images') {
                    data.append(key, values[key]);
                }
            });
    
            // Thêm tệp tin đơn
            if (values.image) {
                data.append('image', values.image);
            }
    
            // Thêm các tệp tin nhiều
            values.images.forEach(file => {
                data.append('images', file);
            });
    
            console.log('FormData sẽ gửi:', data);
    
            try {
                const response = await fetch('http://localhost:3000/products', {
                    method: 'POST',
                    body: data,
                });
    
                if (!response.ok) {
                    const text = await response.text();
                    console.error('Lỗi phản hồi:', text);
                    throw new Error(`Lỗi HTTP! mã lỗi: ${response.status}`);
                }
    
                const result = await response.json();
                console.log('Sản phẩm đã được thêm thành công:', result);
                alert('Sản phẩm đã được thêm thành công!');
                resetForm(); 
            } catch (error) {
                console.error('Lỗi:', error);
                alert('Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.');
            }
        }
    });

    // Trạng thái lỗi và tải danh mục
    if (categoriesError) return <p>Lỗi khi lấy danh mục: {categoriesError.message}</p>;
    if (!categories) return <p>Đang tải danh mục...</p>;

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">Thêm Sản Phẩm</h3>
                <Link href="/admin/product" className="btn btn-outline-secondary rounded-0">
                    <i className="far fa-long-arrow-left"></i> Quay lại
                </Link>
            </div>
            <form className="row" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                {/* Phần Thông Tin Cơ Bản */}
                <div className="col-md-8 mb-4">
                    <div className="card rounded-0 border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <h6 className="pb-3 border-bottom">Thông Tin Cơ Bản</h6>
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="name" className="form-label">Tên *</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-0"
                                        id="name"
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-danger">{formik.errors.name}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="category" className="form-label">Danh Mục *</label>
                                    <select
                                        id="category"
                                        className="form-select rounded-0"
                                        {...formik.getFieldProps('category')}
                                    >
                                        <option value="" disabled>Chọn danh mục</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.category && formik.errors.category && (
                                        <div className="text-danger">{formik.errors.category}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <h6 className="pb-3 border-bottom">Giá</h6>
                                <div className="col mb-3">
                                    <label htmlFor="price" className="form-label">Giá *</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="price"
                                        min="0"
                                        {...formik.getFieldProps('price')}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <div className="text-danger">{formik.errors.price}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="sale" className="form-label">Khuyến Mãi</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="sale"
                                        min="0"
                                        {...formik.getFieldProps('sale')}
                                    />
                                    {formik.touched.sale && formik.errors.sale && (
                                        <div className="text-danger">{formik.errors.sale}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="rating" className="form-label">Đánh Giá</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="rating"
                                        min="0"
                                        max="5"
                                        {...formik.getFieldProps('rating')}
                                    />
                                    {formik.touched.rating && formik.errors.rating && (
                                        <div className="text-danger">{formik.errors.rating}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="view" className="form-label">Số Lượt Xem</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="view"
                                        min="0"
                                        {...formik.getFieldProps('view')}
                                    />
                                    {formik.touched.view && formik.errors.view && (
                                        <div className="text-danger">{formik.errors.view}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="inventory" className="form-label">Kho Hàng *</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="inventory"
                                        min="0"
                                        {...formik.getFieldProps('inventory')}
                                    />
                                    {formik.touched.inventory && formik.errors.inventory && (
                                        <div className="text-danger">{formik.errors.inventory}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Phần Mô Tả */}
                <div className="col-md-4 mb-4">
                    <div className="card rounded-0 border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="pb-3 border-bottom">Mô Tả</h6>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô Tả Ngắn</label>
                                <textarea
                                    className="form-control rounded-0"
                                    id="description"
                                    rows="3"
                                    {...formik.getFieldProps('description')}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <div className="text-danger">{formik.errors.description}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">Nội Dung Chi Tiết</label>
                                <textarea
                                    className="form-control rounded-0"
                                    id="content"
                                    rows="5"
                                    {...formik.getFieldProps('content')}
                                />
                                {formik.touched.content && formik.errors.content && (
                                    <div className="text-danger">{formik.errors.content}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card rounded-0 border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="pb-3 border-bottom">Ảnh Sản Phẩm</h6>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Ảnh Chính</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    onChange={(event) =>
                                        formik.setFieldValue("image", event.currentTarget.files[0])
                                    }
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="images" className="form-label">Ảnh Khác</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="images"
                                    multiple
                                    onChange={(event) =>
                                        formik.setFieldValue("images", Array.from(event.currentTarget.files))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary rounded-0 w-100">
                        Thêm Sản Phẩm
                    </button>
                </div>
            </form>
        </>
    );
}
