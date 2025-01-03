"use client";
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Fetcher function with error handling
const fetcher = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text();
            console.error('Error response:', text);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
};

// Validation schema with Yup
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

export default function ProductEdit({ params }) {
    const router = useRouter();
    const productId = params.id; // Assume the product ID is passed as a route parameter

    // Fetch categories
    const { data: categories, error: categoriesError } = useSWR("http://localhost:3000/categories", fetcher);

    // Fetch product details
    const { data: product, error: productError } = useSWR(productId ? `http://localhost:3000/products/detail/${productId}` : null, fetcher);

    // Formik setup
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: product ? product.name : '',
            category: product ? product.category : '',
            sale: product ? product.sale : '',
            description: product ? product.description : '',
            price: product ? product.price : '',
            content: product ? product.content : '',
            view: product ? product.view : '',
            inventory: product ? product.inventory : '',
            rating: product ? product.rating : '',
            image: null,
            images: [],
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const data = new FormData();

            // Add non-file fields to FormData
            Object.keys(values).forEach(key => {
                if (values[key] !== '' && values[key] !== null && key !== 'image' && key !== 'images') {
                    data.append(key, values[key]);
                }
            });

            // Add single file
            if (values.image) {
                data.append('image', values.image);
            }

            // Add multiple files
            values.images.forEach(file => {
                data.append('images', file);
            });

            console.log('FormData to be sent:', data);
            console.log("Fetching product with ID:", productId);


            try {
                const response = await fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'PUT',
                    body: data,
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error('Error response:', text);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product updated successfully:', result);
                alert('Sản phẩm đã được cập nhật thành công!');
                resetForm();
                router.push('/admin/product'); // Redirect after successful update
            } catch (error) {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi cập nhật sản phẩm. Vui lòng thử lại.');
            }
        }
    });

    // Error and loading states for categories and product
    if (categoriesError) return <p>Lỗi khi tải danh mục: {categoriesError.message}</p>;
    if (!categories) return <p>Đang tải danh mục...</p>;
    
    if (productError) {
        if (productError.message.includes("404")) {
          return <p>Sản phẩm không tìm thấy. Vui lòng kiểm tra lại ID sản phẩm hoặc đảm bảo sản phẩm tồn tại.</p>;
        }
        return <p>Lỗi khi tải chi tiết sản phẩm: {productError.message}</p>;
    }
    
    if (!product) return <p>Đang tải chi tiết sản phẩm...</p>;
    
    return (
       
<>
    <div className="d-flex justify-content-between">
        <h3 className="mb-4">Chỉnh sửa sản phẩm</h3>
        <Link href="/admin/product" className="btn btn-outline-secondary rounded-0">
            <i className="far fa-long-arrow-left"></i> Quay lại
        </Link>
    </div>
    <form className="row" onSubmit={formik.handleSubmit} encType="multipart/form-data">
        {/* Phần thông tin cơ bản */}
        <div className="col-md-8 mb-4">
            <div className="card rounded-0 border-0 shadow-sm mb-4">
                <div className="card-body">
                    <h6 className="pb-3 border-bottom">Thông tin cơ bản</h6>
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
                            <label htmlFor="category" className="form-label">Danh mục *</label>
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
                            <label htmlFor="sale" className="form-label">Giảm giá</label>
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
                            <label htmlFor="rating" className="form-label">Đánh giá</label>
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
                            <label htmlFor="view" className="form-label">Số lượt xem</label>
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
                            <label htmlFor="inventory" className="form-label">Số lượng trong kho *</label>
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
            <div className="card rounded-0 border-0 shadow-sm">
                <div className="card-body">
                    <h6 className="pb-3 border-bottom">Thông Tin</h6>
                    <div className="row">
                        <div className="col mb-3">
                            <label htmlFor="description" className="form-label">Mô tả</label>
                            <textarea
                                className="form-control rounded-0"
                                id="description"
                                rows="6"
                                {...formik.getFieldProps('description')}
                            ></textarea>
                        </div>
                        <div className="col mb-3">
                            <label htmlFor="content" className="form-label">Nội dung</label>
                            <textarea
                                className="form-control rounded-0"
                                id="content"
                                rows="4"
                                {...formik.getFieldProps('content')}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Phần hình ảnh */}
        <div className="col-md-4 mb-4">
            <div className="card rounded-0 border-0 shadow-sm">
                <div className="card-body">
                    <h6 className="pb-3 border-bottom">Hình ảnh</h6>
                    <label className="form-label">Ảnh sản phẩm cũ</label>
                    <img src={`http://localhost:3000/img/${product.image}`} className="w-50" alt="Sản phẩm hiện tại" />
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Ảnh sản phẩm *</label>
                        <input
                            className="form-control rounded-0"
                            type="file"
                            id="image"
                            onChange={(e) => formik.setFieldValue('image', e.target.files[0])}
                        />
                        <div className="bg-secondary-subtle mb-3 p-2 text-center">
                            {formik.values.image ? (
                                <>
                                    <label className="form-label">Ảnh mới</label>
                                    <img
                                        src={URL.createObjectURL(formik.values.image)}
                                        className="w-50"
                                        alt="Ảnh đã chọn"
                                    />
                                </>
                            ) : product.image ? (
                                <img
                                    src={`http://localhost:3000/img/${product.image}`}
                                    className="w-50"
                                    alt="Sản phẩm hiện tại"
                                />
                            ) : null}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="images" className="form-label">Hình ảnh thêm</label>
                        <input
                            className="form-control rounded-0"
                            type="file"
                            id="images"
                            multiple
                            onChange={(e) => formik.setFieldValue('images', Array.from(e.target.files))}
                        />
                        <div className="bg-secondary-subtle mb-3 p-2 text-center d-flex">
                            {formik.values.images && Array.isArray(formik.values.images) ? (
                                formik.values.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(img)}
                                        className="w-25"
                                        alt={`Ảnh đã chọn ${index}`}
                                    />
                                ))
                            ) : product.images && Array.isArray(product.images) ? (
                                product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        className="w-25"
                                        alt={`Sản phẩm hiện tại ${index}`}
                                    />
                                ))
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg rounded-0 mt-4 w-100">Cập nhật sản phẩm</button>
        </div>
    </form>
</>

    );
}
