"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/app/(users)/components/ProductCard";

export default function Pro({ key }) {
  const [data, setProduct] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${key}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("Fetched data:", result);
        // Ensure the fetched data is an array
        setProduct(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message); // Set error message
        setProduct([]); // Set to an empty array on error
      } finally {
        setLoading(false); // Set loading to false
      }
    };
    fetchData();
  }, [key]); // Dependency array to re-fetch data when `key` changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {data.length > 0 ? (
        data.map((product) => (
          <div className="col-sm-6 col-md-4 col-lg-3 my-3" key={product._id}>
            <div className="nav-product-item">
              <div className="nav-product-item-img">
                <a href="#">
                  <img src={`http://localhost:3000/${product.image}`} alt={product.name} />
                </a>
              </div>
              <div className="nav-product-item-category">
                <span>{product.category}</span> {/* Replace with actual category data */}
              </div>
              <div className="nav-product-item-name">
                <h3>{product.name}</h3>
              </div>
              <div className="nav-product-item-price-sale">
                <div className="nav-product-item-price">
                  <h4>
                    {((product.price * (100 - product.sale)) / 100).toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })}
                  </h4>
                </div>
                <div className="nav-product-item-sale">
                  <del>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</del>
                </div>
              </div>
              <div className="nav-product-item-sale-top-img">
                <span>Giảm {product.sale}%</span>
              </div>
              <div className="nav-product-item-start">
                <div className="nav-product-item-start-items">
                  <i className="bi bi-star-fill" aria-hidden="true"></i>
                  <i className="bi bi-star-fill" aria-hidden="true"></i>
                  <i className="bi bi-star-fill" aria-hidden="true"></i>
                  <i className="bi bi-star-fill" aria-hidden="true"></i>
                  <i className="bi bi-star-half" aria-hidden="true"></i>
                </div>
                <div className="nav-product-item-start-danhgia">
                  <span>(55 Đánh Giá)</span> {/* Replace with actual review count */}
                </div>
              </div>
              <div className="nav-product-item-view-heart-return">
                <div className="nav-product-item-view">
                  <a href="#"><i className="bi bi-eye" aria-hidden="true"></i></a>
                </div>
                <div className="nav-product-item-heart">
                  <a href="#"><i className="bi bi-heart" aria-hidden="true"></i></a>
                </div>
                <div className="nav-product-item-return">
                  <a href="#">
                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
              <div className="nav-product-item-button">
                <div className="nav-product-item-button-add-to-cart">
                  <button>Add To Cart</button>
                </div>
                <div className="nav-product-item-button-buy-now">
                  <button>Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </>
  );
}
