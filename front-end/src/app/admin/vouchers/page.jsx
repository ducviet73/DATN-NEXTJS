"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VoucherListWithActions = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voucherStats, setVoucherStats] = useState({
        totalVouchers: 0,
        activeVouchers: 0,
        inactiveVouchers: 0,
    });
      const [showVoucherForm, setShowVoucherForm] = useState(false);
    const [editingVoucherId, setEditingVoucherId] = useState(null);
    useEffect(() => {
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

        fetchVouchers();
    }, []);


    const handleAddVoucherClick = () => {
         setEditingVoucherId(null);
        setShowVoucherForm(true);
    };

    const handleEditVoucherClick = (voucherId) => {
        setEditingVoucherId(voucherId);
        setShowVoucherForm(true);
    };


    const handleVoucherUpdated = () => {
        setShowVoucherForm(false);
        setVouchers(prevVouchers => [...prevVouchers]);
    };

    const handleCloseVoucherForm = () => {
        setShowVoucherForm(false);
    };

    const handleDeleteVoucher = async (id) => {
            try {
                 await axios.delete(`http://localhost:3000/api/vouchers/${id}`);
                 setVouchers(vouchers.filter(voucher => voucher._id !== id));
               } catch (error) {
                     console.error('Error deleting voucher:', error);
               }

    }

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
                        <th>Code</th>
                         <th>Discount Type</th>
                         <th>Discount Value</th>
                        <th>Min Order Amount</th>
                        <th>Start Date</th>
                         <th>End Date</th>
                          <th>Max Uses</th>
                            <th>Uses Count</th>
                        <th>Active</th>
                         <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vouchers.map((voucher, i) => (
                        <tr key={voucher._id} className="text-center">
                            <td>{i + 1}</td>
                            <td>{voucher.voucher_code}</td>
                            <td>{voucher.discount_type}</td>
                            <td>{voucher.discount_value}</td>
                            <td>{voucher.min_order_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>{new Date(voucher.start_date).toLocaleDateString('vi-VN')}</td>
                            <td>{new Date(voucher.end_date).toLocaleDateString('vi-VN')}</td>
                              <td>{voucher.max_uses || "Không giới hạn"}</td>
                             <td>{voucher.uses_count}</td>
                            <td>
                             <span className={`badge ${voucher.is_active === true ? 'bg-success' : 'bg-secondary'}`}>
                                    {voucher.is_active === true ? "Active" : "Inactive"}
                                </span>
                            </td>
                             <td>
                                <button className="btn btn-info btn-sm me-2" onClick={() => handleEditVoucherClick(voucher._id)}>
                                    <i className="fas fa-edit"></i> Sửa
                                </button>
                                 <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVoucher(voucher._id)}>
                                    <i className="fas fa-trash"></i> Xóa
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
                                <h5 className="modal-title">{editingVoucherId ? 'Cập nhật Voucher' : 'Thêm mới Voucher'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseVoucherForm}></button>
                            </div>
                            <div className="modal-body">
                                <VoucherForm voucherId={editingVoucherId} onVoucherUpdated={handleVoucherUpdated} onClose={handleCloseVoucherForm} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const VoucherForm = ({ voucherId, onVoucherUpdated, onClose }) => {
    const [voucher, setVoucher] = useState({
        voucher_code: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_order_amount: 0,
        start_date: '',
        end_date: '',
        max_uses: null,
        is_active: true,
    });
      useEffect(() => {
            if (voucherId) {
                axios.get(`http://localhost:3000/api/vouchers/${voucherId}`)
                    .then(response => {
                      const voucherData = response.data;
                            setVoucher({
                                voucher_code: voucherData.voucher_code || '',
                                discount_type: voucherData.discount_type || 'percentage',
                                discount_value: voucherData.discount_value || 0,
                                min_order_amount: voucherData.min_order_amount || 0,
                                start_date: voucherData.start_date ? new Date(voucherData.start_date).toISOString().split('T')[0] : '',
                                end_date: voucherData.end_date ? new Date(voucherData.end_date).toISOString().split('T')[0] : '',
                                max_uses: voucherData.max_uses || null,
                                is_active: voucherData.is_active
                            });

                    })
                    .catch(error => console.error("Có lỗi xảy ra:", error));
            } else {
               setVoucher({
                    voucher_code: '',
                    discount_type: 'percentage',
                    discount_value: 0,
                    min_order_amount: 0,
                    start_date: '',
                    end_date: '',
                    max_uses: null,
                    is_active: true
               });
           }
        }, [voucherId]);

       const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
           setVoucher(prevVoucher => ({
               ...prevVoucher,
               [name]: type === 'checkbox' ? checked : value
           }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
          const submitData = {
                ...voucher,
                start_date: voucher.start_date ? new Date(voucher.start_date).toISOString() : null,
                 end_date: voucher.end_date ? new Date(voucher.end_date).toISOString() : null
                }
       console.log('Data to submit:', submitData); // Log ở đây

      if (voucherId) {
            axios.put(`http://localhost:3000/api/vouchers/${voucherId}`, submitData)
                .then(() => {
                  onVoucherUpdated();
                })
                .catch(error => console.error("Có lỗi xảy ra:", error));
        } else {
            axios.post(`http://localhost:3000/api/vouchers`, submitData)
                .then(() => {
                    onVoucherUpdated();
                })
                .catch(error => console.error("Có lỗi xảy ra:", error));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Code</label>
                <input
                    type="text"
                    className="form-control"
                    name="voucher_code"
                    value={voucher.voucher_code}
                    onChange={handleChange}
                     required
                />
            </div>
            <div className="form-group">
                <label>Discount Type</label>
                <select name="discount_type" className="form-control" value={voucher.discount_type} onChange={handleChange}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed amount">Fixed Amount</option>
                </select>
            </div>
               <div className="form-group">
                <label>Discount Value</label>
                <input
                    type="number"
                    className="form-control"
                    name="discount_value"
                    value={voucher.discount_value}
                     onChange={handleChange}
                      required
                />
            </div>
            <div className="form-group">
                <label>Min Order Amount</label>
                <input
                    type="number"
                    className="form-control"
                    name="min_order_amount"
                    value={voucher.min_order_amount}
                    onChange={handleChange}

                />
            </div>
            <div className="form-group">
                <label>Start Date</label>
                <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    value={voucher.start_date}
                   onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>End Date</label>
                <input
                    type="date"
                    className="form-control"
                    name="end_date"
                    value={voucher.end_date}
                   onChange={handleChange}
                />
            </div>
                <div className="form-group">
                <label>Max Uses</label>
                <input
                    type="number"
                    className="form-control"
                    name="max_uses"
                    value={voucher.max_uses || ''}
                    onChange={handleChange}
                      />
            </div>

            <div className="form-group">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_active"
                        checked={voucher.is_active}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Is Active</label>
                </div>
            </div>
            <button type="submit" className="btn btn-primary">{voucherId ? 'Update' : 'Create'} Voucher</button>
           <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Cancel</button>
        </form>
    );
};

export default VoucherListWithActions;