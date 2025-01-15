"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';

// Hàm lấy dữ liệu từ API
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Product() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lấy dữ liệu sản phẩm theo trang hiện tại
  const { data: productData, error, isLoading } = useSWR(
    `http://localhost:3000/products/page?page=${currentPage}&limit=5`,
    fetcher,
    {
      refreshInterval: 10000, // Tự động làm mới mỗi 10 giây
    }
  );

  // Xử lý hành động xóa sản phẩm
  const deleteItem = async (itemId) => {
    if (confirm('Bạn có chắc chắn muốn xóa không?')) {
      try {
        const response = await fetch(`http://localhost:3000/products/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          alert('Sản phẩm đã được xóa thành công');
          mutate(); // SWR's mutate để làm mới dữ liệu
        } else {
          alert('Đã có lỗi xảy ra: ' + data.message);
        }
      } catch (error) {
        alert('Lỗi mạng: ' + error.message);
      }
    }
  };

  // Cập nhật totalPages và currentPage dựa trên dữ liệu đã lấy
  useEffect(() => {
    if (productData) {
      setTotalPages(productData.countPages);
      setCurrentPage(productData.currentPage);
    }
  }, [productData]);

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

  if (error) return <div className="alert alert-danger">Lỗi load dữ liệu.</div>;
  if (isLoading) return <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Đang tải...</span></div>;

  // Tạo danh sách các số trang cho phân trang
  const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Sản phẩm</h3>
        <div>
          <a href="/admin/category" className="btn btn-outline-success rounded-0 me-2">Quản lý danh mục</a>
          <Link href="/admin/product/add" className="btn btn-primary rounded-0">Thêm sản phẩm</Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-primary-subtle text-primary">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-box"></i>
                {productData?.countPro || 0}
              </div>
              SẢN PHẨM
            </div>
          </div>
        </div>
      </div>

      <div className="card rounded-0 border-0 shadow-sm mb-4">
        <div className="card-body">
          <table className="table table-striped text-center">
            <thead className="table-dark">
              <tr>
                <th className="text-start" colSpan="2">Sản phẩm</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Đánh giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {productData?.result?.map(product => {
                const { _id, name, image, price, sale, rating, inventory, category } = product;
                const discountedPrice = ((price * (100 - sale)) / 100).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                });
                const originalPrice = price.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                });

                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 !== 0;

                return (
                  <tr key={_id}>
          <td style={{ width: "64px" }}>
            <img
              src={image ? `${image}?t=${new Date().getTime()}` : ""}
              alt={name}
              className="img-thumbnail"
            />
          </td>
                    <td className="text-start">
                      <strong>{name}</strong>
                      <br />
                      <small>
                        Id: <strong>{_id}</strong> |
                        Danh mục: <a href="#" className="text-decoration-none fw-bold">{category?.name || 'N/A'}</a>
                      </small>
                    </td>
                    <td>
                      {discountedPrice}
                      {/* <br /><del>{originalPrice}</del> */}
                    </td>
                    <td>{inventory}</td>
                    <td>
                      {rating}
                      <br />
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-star ${i < fullStars ? 'fas text-warning' : 'far text-warning'}`}
                        ></i>
                      ))}
                      {hasHalfStar && <i className="fas fa-star-half-alt text-warning"></i>}
                    </td>
                    <td>
                      <Link href={`/admin/product/${_id}`} className="btn btn-primary btn-sm me-2">
                        <i className="fas fa-eye fa-fw"></i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteItem(_id)}
                      >
                        <i className="fas fa-times fa-fw"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination-controls d-flex justify-content-center align-items-center mt-4">
  <button
    onClick={handlePrev}
    className={`btn btn-outline-primary rounded-0 mx-1 ${currentPage === 1 ? 'disabled' : ''}`}
    disabled={currentPage === 1}
  >
    <i className="bi bi-chevron-left"></i> Trước
  </button>
  {pageNumbers.map((page) => (
    <button
      key={page}
      onClick={() => handleGoTo(page)}
      className={`btn mx-1 rounded-0 ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
    >
      {page}
    </button>
  ))}
  <button
    onClick={handleNext}
    className={`btn btn-outline-primary rounded-0 mx-1 ${currentPage === totalPages ? 'disabled' : ''}`}
    disabled={currentPage === totalPages}
  >
    Tiếp <i className="bi bi-chevron-right"></i>
  </button>
</div>

    </div>
  );
}