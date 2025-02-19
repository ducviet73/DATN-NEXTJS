"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import "../../../../public/bootstrap/css/cart.css";
import { clearCart } from '@/redux/slices/cartSlices';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.items) || [];
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.auth.user);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
     const [phoneNumber, setPhoneNumber] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0); // State for discount amount
    const total = useMemo(() => 
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0), 
        [cartItems]
    );

    useEffect(() => {
        // Fetch data from the API
        axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then(response => {
                const data = response.data;
                setCities(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        const selectedCityObj = cities.find(city => city.Id === cityId);
        setDistricts(selectedCityObj ? selectedCityObj.Districts : []);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
    };
    

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        const selectedCityObj = cities.find(city => city.Districts.some(district => district.Id === districtId));
        const selectedDistrictObj = selectedCityObj?.Districts.find(district => district.Id === districtId);
        setWards(selectedDistrictObj?.Wards || []);
        setSelectedWard('');
    };

    // voucher
    const applyVoucher = async () => {
        if (!voucherCode) {
            setErrorMessage('Please enter a voucher code.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/vouchers/${voucherCode}`);
            if (response.data) {
                 if (response.data.is_active === false) {
                        setErrorMessage("Voucher has expired.");
                         return;
                     }
                setErrorMessage('');
                console.log("voucher info: ", response.data);

                if (response.data.min_order_amount > total) {
                        setErrorMessage(`Voucher requires a minimum purchase of ${response.data.min_order_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`);
                         return;
                 }
                 let discountValue;
                if (response.data.discount_type === 'percentage') {
                     discountValue = (total * response.data.discount_value) / 100;

                } else if (response.data.discount_type === 'fixed amount') {
                     discountValue =  response.data.discount_value;
                 }
                  setDiscountAmount(discountValue);
                console.log("discountAmount after apply voucher: ", discountAmount);

            }
        } catch (error) {
             console.error('Error applying voucher:', error);
            setErrorMessage('Invalid voucher code.');
        }
    };


    const handleCheckout = async () => {
        if (!customerName || !customerEmail || !paymentMethod || !selectedCity || !selectedDistrict || !selectedWard || !phoneNumber) {
            setErrorMessage('Please provide all required information.');
            return;
        }

        setErrorMessage('');
        setIsSubmitting(true);
   console.log("total before reduce: ", total);
    console.log("discountAmount before reduce: ", discountAmount);
        const orderDetails = {
            userId: user?._id,
            totalAmount: total - discountAmount, // Apply discount
             phoneNumber: phoneNumber,
            shippingAddress: {
                street: shippingAddress,
                ward: wards.find(ward => ward.Id === selectedWard)?.Name || '',
                district: districts.find(district => district.Id === selectedDistrict)?.Name || '',
                city: cities.find(city => city.Id === selectedCity)?.Name || ''
            },
            paymentMethod,
            status: 'pending',
            details: cartItems.map(item => ({
                productId: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            voucher_code: voucherCode
        };
         console.log("order detail before fetch: ", orderDetails);
    
        try {
            const response = await fetch(`http://localhost:3000/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });
            console.log("Full response: ", response); // ADDED LOG
            const data = await response.json();
            if (response.ok) {
                dispatch(clearCart());
                alert("Cảm ơn bạn đã đặt hàng! Chúng tôi đã gửi một email xác nhận tới địa chỉ của bạn cùng với hóa đơn..");
                  if (data.updatedProducts) {
                       console.log("Updated products: ", data.updatedProducts);
                   }
                router.push('/orders');
            } else {
                
                 console.error("Response data:", data);
                setErrorMessage(data.error || 'Failed to submit order');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            setErrorMessage('Error submitting order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container my-5">
            <h1>Thanh Toán</h1>

            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="customerName">Tên khách hàng</label>
                        <input
                            type="text"
                            className="form-control"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerEmail">Email khách hàng</label>
                        <input
                            type="email"
                            className="form-control"
                            id="customerEmail"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                         <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                      </div>
                    <div className="form-group">
                        <label htmlFor="voucherCode">Mã giảm giá</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id="voucherCode"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" onClick={applyVoucher}>Áp dụng</button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="shippingAddress">Địa chỉ cụ thể</label>
                        <input
                            type="text"
                            className="form-control"
                            id="shippingAddress"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">Thành phố</label>
                        <select
                            className="form-control"
                            id="city"
                            value={selectedCity}
                            onChange={handleCityChange}
                        >
                            <option value="">Chọn thành phố</option>
                            {cities.map(city => (
                                <option key={city.Id} value={city.Id}>{city.Name}</option>
                            ))}

                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="district">Huyện</label>
                        <select
                            className="form-control"
                            id="district"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                        >
                            <option value="">Chọn Huyện</option>
                            {districts.map(district => (
                                <option key={district.Id} value={district.Id}>{district.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ward">Phường</label>
                        <select
                            className="form-control"
                            id="ward"
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                        >
                            <option value="">Chọn Phường</option>
                            {wards.map(ward => (
                                <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentMethod">Thanh toán</label>
                        <select
                            className="form-control"
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">Chọn phương thức thanh toán</option>
                            <option value="cash">Thanh toán khi nhận hàng</option>
                            {/* <option value="card">Chuyển khoản</option> */}
                        </select>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={handleCheckout}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Đặt hàng'}
                    </button>
                </div>
                <div className="col-md-6">
                        <h2>Giỏ Hàng</h2>
                        <div className="cart-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                     <div className="row">
                                         <div className="col-4">
                                        <img
                                        src={item.image} alt={item.image}
                                            style={{ height: "250px", width: "100%" }}
                                         />                                        </div>
                                         <div className="col-8">
                                            <h5>{item.name}</h5>
                                            <p>Số lượng: {item.quantity}</p>
                                             <p>Giá: {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                            </div>
                                     </div>
                                 </div>
                             ))}
                         </div>                         
                         <div className="total-amount">
                         <h4 style={{marginTop: "10px"}}>
                                Tổng Tiền: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </h4>
                            {discountAmount > 0 && (
                            <h4 style={{marginTop: "10px", color: "green"}}>
                             Giảm giá: {discountAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                             </h4>
                                )}
                              {discountAmount > 0 && (
                            <h4 style={{marginTop: "10px", color: "green"}}>
                              Tổng tiền sau giảm giá: {(total - discountAmount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </h4>
                            )}
                         </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;