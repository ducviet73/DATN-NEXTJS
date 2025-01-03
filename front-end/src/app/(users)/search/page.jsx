import React from 'react';
import ProductCard from '../components/ProductCard';

export default async function Search({ searchParams }) {
    const keyword = searchParams.keyword;
    console.log(searchParams);
    
    try {
        const res = await fetch(`http://localhost:3000/products/search/${keyword}`, { cache: 'no-store' });
        
        // Kiểm tra nếu có lỗi khi fetch
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        
        const productSearch = await res.json();
        
        // Kiểm tra nếu không có sản phẩm tìm thấy
        if (productSearch.length === 0) {
            return (
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-12">
                            <h3>Kết quả tìm kiếm cho từ khóa: {keyword}</h3>
                            <p>Không có sản phẩm nào phù hợp với từ khóa này.</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Nếu có sản phẩm, hiển thị chúng
        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col-12">
                        <h3>Kết quả tìm kiếm cho từ khóa: {keyword}</h3>
                        <div className="row">
                            <ProductCard data={productSearch} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col-12">
                        <h3>Kết quả tìm kiếm cho từ khóa: {keyword} không có !</h3>
                        <p> vui lòng thử lại sau</p>
                    </div>
                </div>
            </div>
        );
    }
}
