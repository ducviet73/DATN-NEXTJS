"use client";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../../redux/slices/counterSlice'; // Sửa đường dẫn nếu cần
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import "../../../../public/bootstrap/css/cart.css";
import Link from 'next/link';
import OrderHistory from '../components/lichsudonhang';
const CartPage = () => {

    const cartItems = useSelector(state => state.cart.items) || [];
    const updatedCartItems = cartItems.map(item => ({
        ...item,
        price: item.price * (1 - (item.sale ? item.sale / 100 : 0))
    }));
    const dispatch = useDispatch();
    const router = useRouter();

    const handleRemoveFromCart = (itemId, size, color) => {
        dispatch(removeFromCart({ _id: itemId, size, color }));
    };


    const user = useSelector(state => state.auth.user);

    console.log("cart", cartItems);
    console.log("cart", user ? user._id : "No user");

    cartItems.forEach((item, index) => {
        console.log(`Sản phẩm ${index + 1}:`, item);
    });

    const handleCheckout = () => {
        if (user && user._id) {
            if (cartItems.length === 0) {
                alert("Giỏ hàng của bạn không có sản phẩm để thanh toán.");
                return;
            }
            router.push('/checkout');
        } else {
            alert("Vui lòng đăng nhập trước khi thanh toán.");
            router.push('/login');
        }
    };



    const total = useMemo(() => {
        return cartItems.reduce((total, item) => {
            // Calculate price after discount if applicable
            const discountedPrice = item.sale ? item.price * (1 - item.sale / 100) : item.price;
            return total + (discountedPrice * item.quantity);
        }, 0);
    }, [cartItems]);


    return (
        <div className="container">
            <h3>Giỏ hàng của bạn</h3>
            <div className="thongtin-sp">
                <ul className="thongtin-all">
                    <li>Sản phẩm</li>
                    <li>Đơn giá</li>
                    <li>Số lượng</li>
                    <li>Thành tiền</li>
                    <li>Xóa</li>
                </ul>
            </div>
            <form action="#">
                <table>
                    <tbody>
                        {updatedCartItems.map((item) => (
                            <tr className="thanhtoan-all" key={`${item._id}-${item.size}-${item.color}`}>
                                <td className="thanhtoan-1">
                                    <img
                                        src={item.image }
                                        alt={item.name}
                                    />
                                </td>
                                <td className="thanhtoan-2">
                                    <span className="ten-sp">{item.name}</span>
                                </td>
                                <td className="thanhtoan-3">
                                    <p>
                                        {item.price.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}
                                    </p>
                                </td>
                                <td className="thanhtoan-4">
                                    <div className="thanhtoan-4-1">
                                        <input
                                            min="1"
                                            type="number"
                                            value={item.quantity}
                                            onChange={e => dispatch(updateCartItemQuantity({ _id: item._id, size: item.size, color: item.color, quantity: parseInt(e.target.value, 10) }))}
                                        />
                                    </div>
                                </td>
                                <td className="thanhtoan-5">
                                    {(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </td>
                                <td className="thanhtoan-6">
                                    <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item._id, item.size, item.color)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </form>
            <div className="ghichu-all">
                <div className="ghichu">
                    <div className="ghichu-1">
                        <textarea
                            id="note"
                            name="note"
                            rows="4"
                            cols="50"
                            placeholder="Ghi chú"
                        ></textarea>
                    </div>
                    <div className="ghichu-2">
                        <div className="tong-all">
                            <p className="tong">Tổng: <span>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
                        </div>
                        <div className="thanhtoan-btn">
                            <button className="thanhtoan-btn-1">Cập nhật giỏ hàng</button>
                            <button className="thanhtoan-btn-2" onClick={handleCheckout}>
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tieptuc">
                <Link href="/">
                    <p><i className="fa-solid fa-reply"></i>Tiếp tục mua hàng</p>
                </Link>
            </div>
        </div>
    );
};

export default CartPage;
