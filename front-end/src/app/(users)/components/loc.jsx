'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function loc() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('asc');

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('http://localhost:3000/products');
      const newProducts = await res.json();
      setProducts(newProducts);
    }
    fetchProducts();
  }, []);


  return (
    <div className="container my-3">
      <div>
        <div className=" d-flex justify-content-between mx-1 ">
          <div className="p-1 w-auto">
            <h5 className="text-success">DANH SÁCH SẢN PHẨM</h5>
          </div>
          <div>
            <input type="checkbox" id="showAll" name="showAll" value="showAll"  className='me-2'  />
            <label htmlFor="showAll" className='me-2'>Hiển thị tất cả</label>
            <input type="checkbox" id="showPhone" name="showPhone" value="showPhone"  className='me-2'  />
            <label htmlFor="showPhone" className='me-2'>Điện thoại</label>
            <input type="checkbox" id="showLaptop" name="showLaptop" value="showLaptop"  className='me-2'  />
            <label htmlFor="showLaptop" className='me-2'>Laptop</label>
            <input type="checkbox" id="showLinhKien" name="showLinhKien" value="showLinhKien"  className='me-2'  />
            <label htmlFor="showLinhKien" className='me-2'>Linh kiện</label>
          </div>
          <select className="form-select w-auto">
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>
        <div className="row ">
          <ProductCard data={products} />
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}
  