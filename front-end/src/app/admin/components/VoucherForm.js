 import React, { useState, useEffect } from 'react';
 import axios from 'axios';

 const VoucherForm = ({ voucher, onVoucherUpdated, onClose }) => {
     const [formVoucher, setFormVoucher] = useState({
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
           if (voucher) {
              setFormVoucher({
                 voucher_code: voucher.voucher_code || '',
                 discount_type: voucher.discount_type || 'percentage',
                 discount_value: voucher.discount_value || 0,
                 min_order_amount: voucher.min_order_amount || 0,
                 start_date: voucher.start_date ? new Date(voucher.start_date).toISOString().split('T')[0] : '',
                 end_date: voucher.end_date ? new Date(voucher.end_date).toISOString().split('T')[0] : '',
                 max_uses: voucher.max_uses || null,
                 is_active: voucher.is_active,
             });

             }
          else {
               setFormVoucher({
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
        }, [voucher]);


     const handleChange = (e) => {
         const { name, value, type, checked } = e.target;
         setFormVoucher(prevVoucher => ({
             ...prevVoucher,
            [name]: type === 'checkbox' ? checked : value
         }));
     };

    const handleSubmit = (e) => {
         e.preventDefault();
         const submitData = {
             ...formVoucher,
             start_date: formVoucher.start_date ? new Date(formVoucher.start_date).toISOString() : null,
             end_date: formVoucher.end_date ? new Date(formVoucher.end_date).toISOString() : null
         }
         console.log('Data to submit:', submitData); // Log ở đây

         if (voucher) {
             axios.put(`http://localhost:3000/api/vouchers/${voucher._id}`, submitData)
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
                 <label>Mã Khuyến Mãi</label>
                 <input
                     type="text"
                     className="form-control"
                     name="voucher_code"
                     value={formVoucher.voucher_code}
                     onChange={handleChange}
                     required
                  />
              </div>
             <div className="form-group">
                 <label>Loại Giảm Giá</label>
                 <select name="discount_type" className="form-control" value={formVoucher.discount_type} onChange={handleChange}>
                     <option value="percentage">Tỷ lệ phần trăm</option>
                     <option value="fixed amount">Số tiền cố định</option>
                 </select>
              </div>
             <div className="form-group">
                 <label>Giá Trị Giảm Giá</label>
                 <input
                     type="number"
                     className="form-control"
                     name="discount_value"
                     value={formVoucher.discount_value}
                     onChange={handleChange}
                     required
                 />
              </div>
             <div className="form-group">
                 <label>Tiền Đặt Hàng Tối Thiểu</label>
                 <input
                    type="number"
                    className="form-control"
                     name="min_order_amount"
                     value={formVoucher.min_order_amount}
                     onChange={handleChange}

                 />
             </div>
             <div className="form-group">
                 <label>Ngày Bắt Đầu</label>
                 <input
                    type="date"
                     className="form-control"
                     name="start_date"
                     value={formVoucher.start_date}
                     onChange={handleChange}
                 />
             </div>
            <div className="form-group">
                <label>Ngày Kết Thúc</label>
                 <input
                     type="date"
                     className="form-control"
                     name="end_date"
                     value={formVoucher.end_date}
                     onChange={handleChange}
                 />
              </div>
               <div className="form-group">
                <label>Số lượng dùng</label>
                <input
                    type="number"
                    className="form-control"
                    name="max_uses"
                     value={formVoucher.max_uses || ''}
                     onChange={handleChange}
                 />
              </div>
                <div className="form-group">
                     <div className="form-check">
                         <input
                             type="checkbox"
                             className="form-check-input"
                             name="is_active"
                             checked={formVoucher.is_active}
                             onChange={handleChange}
                         />
                         <label className="form-check-label">Hoạt động</label>
                     </div>
                 </div>
             <button type="submit" className="btn btn-primary">{voucher ? 'Cập nhật' : 'Thêm'} Mã Giảm Giá</button>
             <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Hủy</button>
         </form>
     );
 };

 export default VoucherForm;