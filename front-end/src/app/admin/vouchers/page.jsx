"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VoucherForm from '../components/VoucherForm'

const VoucherListWithActions = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voucherStats, setVoucherStats] = useState({
        totalVouchers: 0,
        activeVouchers: 0,
        inactiveVouchers: 0,
    });
     const [showVoucherForm, setShowVoucherForm] = useState(false);
     const [editingVoucher, setEditingVoucher] = useState(null);

     const fetchVouchers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/vouchers`);
                const voucherList = response.data;
                setVouchers(voucherList);
                setVoucherStats({
                    totalVouchers: voucherList.length,
                    activeVouchers: voucherList.filter(voucher => voucher.is_active === true).length,
                    inactiveVouchers: voucherList.filter(voucher => voucher.is_active === false).length,

                });
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {
       fetchVouchers();
    }, []);

    const handleAddVoucherClick = () => {
        setEditingVoucher(null);
        setShowVoucherForm(true);
    };
    const handleEditVoucherClick = async (voucherId) => {
        try {
             const voucher = vouchers.find(v=> v._id === voucherId)
             const response = await axios.get(`http://localhost:3000/api/vouchers/${voucher.voucher_code}`);
              setEditingVoucher(response.data);
              setShowVoucherForm(true);
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
             }

     };

    const handleVoucherUpdated = () => {
        setShowVoucherForm(false);
        fetchVouchers();
    };

    const handleCloseVoucherForm = () => {
        setShowVoucherForm(false);
    };

    const handleDeleteVoucher = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/vouchers/${id}`);
            setVouchers(vouchers.filter(voucher => voucher._id !== id));
             setVoucherStats(prevState => ({
                   ...prevState,
                totalVouchers: prevState.totalVouchers - 1,
                activeVouchers: vouchers.filter(voucher => voucher._id !== id && voucher.is_active === true).length,
                  inactiveVouchers: vouchers.filter(voucher => voucher._id !== id && voucher.is_active === false).length,
              }));
        } catch (error) {
            console.error('Error deleting voucher:', error);
        }
    }
    const translateDiscountType = (type) => {
         switch (type) {
              case "percentage":
                  return "Phần trăm giảm giá";
              case "fixed amount":
                 return "Số tiền cố định";
               default:
                   return type;
        }
     };

if (loading) return <p>Loading...</p>;

return (
    <div className="container mt-5">
        <h2 className="text-center mb-4">Quản Lý Voucher</h2>
         <div className="d-flex justify-content-between align-items-center mb-4">
            <button className="btn btn-primary" onClick={handleAddVoucherClick}>
                <i className="fas fa-plus"></i> Thêm mới
            </button>
              <div className="row mb-4">
                    <div className="col-md-4">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h5 className="card-title">Tổng số voucher</h5>
                            <p className="card-text fs-4">{voucherStats.totalVouchers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h5 className="card-title">Voucher đang hoạt động</h5>
                            <p className="card-text fs-4">{voucherStats.activeVouchers}</p>
                        </div>
                     </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-secondary">
                        <div className="card-body">
                            <h5 className="card-title">Voucher không hoạt động</h5>
                            <p className="card-text fs-4">{voucherStats.inactiveVouchers}</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>


        <table className="table table-bordered">
            <thead className="table-dark text-center">
                <tr>
                    <th>#</th>
                    <th>Mã Khuyến Mãi</th>
                    <th>Loại Giảm Giá</th>
                    <th>Giá Trị Giảm Giá</th>
                    <th>Tiền Đặt Hàng Tối Thiểu</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Ngày Kết Thúc</th>
                    <th>Số Lượng Dùng</th>
                    <th>Số Lượng Đã Dùng</th>
                    <th>Hoạt Động</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
             <tbody>
                    {vouchers.map((voucher, i) => (
                       <tr key={voucher._id} className="text-center">
                            <td>{i + 1}</td>
                            <td>{voucher.voucher_code}</td>
                           <td>{translateDiscountType(voucher.discount_type)}</td>
                            <td>{voucher.discount_value}</td>
                            <td>{voucher.min_order_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>{new Date(voucher.start_date).toLocaleDateString('vi-VN')}</td>
                            <td>{new Date(voucher.end_date).toLocaleDateString('vi-VN')}</td>
                            <td>{voucher.max_uses || "Không giới hạn"}</td>
                            <td>{voucher.uses_count}</td>
                            <td>
                                <span className={`badge ${voucher.is_active === true ? 'bg-success' : 'bg-secondary'}`}>
                                    {voucher.is_active === true ? "Hoạt động" : "Không hoạt động"}
                                </span>
                            </td>

                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditVoucherClick(voucher._id)}>
                                    <i className="fas fa-eye fa-fw"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteVoucher(voucher._id)}
                                >
                                    <i className="fas fa-times fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
        </table>
         {showVoucherForm && (
             <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingVoucher ? 'Cập nhật Voucher' : 'Thêm mới Voucher'}</h5>
                            <button type="button" className="btn-close" onClick={handleCloseVoucherForm}></button>
                         </div>
                        <div className="modal-body">
                            <VoucherForm voucher={editingVoucher} onVoucherUpdated={handleVoucherUpdated} onClose={handleCloseVoucherForm} />
                        </div>
                    </div>
                </div>
            </div>
         )}
    </div>
);
};

export default VoucherListWithActions;