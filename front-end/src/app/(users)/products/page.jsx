"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Banner from "../components/Banner";
import "../../../../public/bootstrap/css/product.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [showSale, setShowSale] = useState(false);
  const [showHot, setShowHot] = useState(false);
  const [showBestselling, setShowBestselling] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (page = 1, limit = 4) => {
    try {
      const res = await fetch(`http://localhost:3000/products/page?page=${page}&limit=${limit}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
    
      const data = await res.json();
      const products = data.result;
      const processedData = products.map((product) => ({
        ...product,
        finalPrice:
          product.sale > 0
            ? (product.price * (1 - product.sale / 100)).toFixed(2)
            : product.price,
      }));
      setProducts(processedData);

      setTotalPages(data.countPages);
console.log(data.countPages);
      // Uncomment this block to set unique categories
      // const uniqueCategories = [...new Set(data.products.map((product) => product.categoryDetails.name))];
      // setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);
  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);

  const getFilteredProducts = () => {
    let filteredProducts = [...products];

    if (!showAll) {
      if (showSale) {
        filteredProducts = filteredProducts.filter((product) => product.sale > 0);
      }
      if (showHot) {
        filteredProducts = filteredProducts.filter((product) => product.view > 70);
      }
      if (showBestselling) {
        filteredProducts = filteredProducts.sort((a, b) => b.inventory - a.inventory);
      }
    }

    if (priceRange.min || priceRange.max) {
      const min = parseFloat(priceRange.min) || 0;
      const max = parseFloat(priceRange.max) || Infinity;
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryDetails.name === selectedCategory
      );
    }

    filteredProducts.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.price - a.price;
      } else {
        return a.price - b.price;
      }
    });

    return filteredProducts;
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoTo = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <>
      <Banner />
      <div className="container my-3">
        <div className="row">
          <div className="row d-flex justify-content-between mx-1">
            <div className="p-1 w-auto">
              <h5 className="text-success">SẢN PHẨM</h5>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div>
              <h3>Bộ lọc tìm kiếm</h3>
              <input
                className="product-hien"
                type="checkbox"
                id="showAll"
                checked={showAll}
                onChange={(e) => {
                  setShowAll(e.target.checked);
                  setShowSale(false);
                  setShowHot(false);
                  setShowBestselling(false);
                  setPriceRange({ min: "", max: "" });
                  setSelectedCategory("");
                }}
              />
              <label htmlFor="showAll" className="product-hien-1">
                Hiển thị tất cả
              </label>
              <br />
              <input
                type="checkbox"
                id="showsale"
                checked={showSale}
                onChange={(e) => setShowSale(e.target.checked)}
                className="me-2"
              />
              <label htmlFor="showsale" className="product-hien">
                Sản phẩm sale
              </label>
              <br />
              <input
                type="checkbox"
                id="showhot"
                checked={showHot}
                onChange={(e) => setShowHot(e.target.checked)}
                className="me-2"
              />
              <label htmlFor="showhot" className="product-hien">
                Sản phẩm hot
              </label>
              <br />
              <input
                type="checkbox"
                id="showbestselling"
                checked={showBestselling}
                onChange={(e) => setShowBestselling(e.target.checked)}
                className="me-2"
              />
              <label htmlFor="showbestselling" className="product-hien">
                Sản phẩm bán chạy
              </label>
            </div>
            <br />
            <div>
              <h5>Lựa chọn mức giá phù hợp</h5>
              <button
                onClick={() => setPriceRange({ min: 500000, max: 2000000 })}
                className="btn btn-outline-success mt-2"
              >
                500,000 - 2,000,000
              </button>
              <button
                onClick={() => setPriceRange({ min: 2000000, max: 4000000 })}
                className="btn btn-outline-success mt-2"
              >
                2,000,000 - 4,000,000
              </button>
              <button
                onClick={() => setPriceRange({ min: 4000000, max: 6000000 })}
                className="btn btn-outline-success mt-2"
              >
                4,000,000 - 6,000,000
              </button>
              <button
                onClick={() => setPriceRange({ min: 6000000, max: 10000000 })}
                className="btn btn-outline-success mt-2"
              >
                6,000,000 - 10,000,000
              </button>
              <button
                onClick={() => setPriceRange({ min: "", max: "" })}
                className="btn btn-outline-success mt-2"
              >
                Xóa khoảng giá
              </button>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row mt-3">
              <select
                id="categorySelect"
                className="form-select w-auto mt-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="form-select w-auto mt-2"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </select>
            </div>
            <div className="row mt-3">
              {filteredProducts.length === 0 ? (
                <p>Sản phẩm chưa đáp ứng đủ các yếu tố trên.</p>
              ) : (
                <ProductCard data={filteredProducts} />
              )}
            </div>
            <div className="">
              <button
                onClick={handlePrev}
                className="pagination-item"
                disabled={currentPage === 1}
              >
              <i class="bi bi-arrow-left-short"></i>
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handleGoTo(page)}
                  // className={` ${page === currentPage ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                className="pagination-item"
                disabled={currentPage === totalPages}
              >
              <i class="bi bi-arrow-right-short"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
