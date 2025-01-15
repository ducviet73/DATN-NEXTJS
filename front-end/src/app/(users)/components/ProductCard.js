'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlices';

function ProductCard({ data = [] }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1); // Số lượng mặc định
  const [selectedSize, setSelectedSize] = useState('38'); // Size mặc định
  const [selectedColor, setSelectedColor] = useState('white'); // Màu mặc định

  const handleAddToCart = (itemId, quantity, selectedSize, selectedColor) => {
    const item = data.find(product => product._id === itemId);
    if (item) {
      dispatch(addToCart({ item, quantity, size: selectedSize, color: selectedColor }));
      console.log('Added to cart successfully!');
      router.push('/cart');
    } else {
      console.error('Item not found in data');
    }
  };

  const handleDetail = (id) => {
    router.push(`/products/${id}`);
  };

  if (!data || !Array.isArray(data)) {
    return <p>Không có dữ liệu sản phẩm để hiển thị.</p>;
  }

  return (
    <>
      {data.map((product) => {
        const { _id, name, image, price, sale, rating } = product;

        // Tính giá đã giảm và định dạng tiền tệ
        const discountedPrice = ((price * (100 - sale)) / 100).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        const originalPrice = price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });

        // Tính số sao đầy đủ và nửa sao
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const totalStars = 5;

        return (
          <div className="col-sm-6 col-md-4 col-lg-3 my-3" key={_id}>
            <div className="nav-product-item">
              <div className="nav-product-item-img">
                <Link href={`/products/${_id}`}>
                <img src={image} alt={name} style={{height:"348px"}}/>
                </Link>
              </div>
              <div className="nav-product-item-name">
                <h3>{name}</h3>
              </div>
              <div className="nav-product-item-price-sale">
                <div className="nav-product-item-price">
                  <h4>{discountedPrice}</h4>
                </div>
                <div className="nav-product-item-sale">
                  <del>{originalPrice}</del>
                </div>
              </div>
              <div className="nav-product-item-start">
                <div className="nav-product-item-start-items">
                  {[...Array(fullStars)].map((_, index) => (
                    <i key={`full-${index}`} className="bi bi-star-fill" aria-hidden="true"></i>
                  ))}
                  {hasHalfStar && <i className="bi bi-star-half" aria-hidden="true"></i>}
                  {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
                    <i key={`empty-${index}`} className="bi bi-star" aria-hidden="true"></i>
                  ))}
                </div>
              </div>
              <div className="nav-product-item-button">
                <div className="nav-product-item-button-add-to-cart">
                  <button
                    className="detail_addtocart"
                    onClick={() => handleAddToCart(_id, quantity, selectedSize, selectedColor)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
                <div className="nav-product-item-button-buy-now">
                  <button onClick={() => handleDetail(_id)}>Xem Chi Tiết</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ProductCard;
