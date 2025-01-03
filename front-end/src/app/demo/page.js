"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Checkout = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        // Fetch data from the provided API
        axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then(response => {
                const data = response.data;
                setCities(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Handle city change to update districts
    const handleCityChange = (e) => {
        const city = JSON.parse(e.target.value);
        setValue('city', city.Id);
        setDistricts(city.Districts);
        setWards([]);
    };

    // Handle district change to update wards
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setValue('district', districtId);
        const selectedCity = cities.find(city => city.Districts.some(district => district.Id === districtId));
        const selectedDistrict = selectedCity?.Districts.find(district => district.Id === districtId);
        setWards(selectedDistrict?.Wards || []);
    };

    const onSubmit = (data) => {
        console.log('Form data:', data);
        alert('Form data:', JSON.stringify(data, null, 2));
    };

    return (
        <div className="container">
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">Họ tên:</label>
                    <input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Họ tên là bắt buộc' })}
                    />
                    {errors.name && <p className="error">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="phone">Số điện thoại:</label>
                    <input
                        id="phone"
                        type="text"
                        {...register('phone', { 
                            required: 'Số điện thoại là bắt buộc', 
                            pattern: {
                                value: /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/,
                                message: 'Số điện thoại không hợp lệ'
                            }
                        })}
                    />
                    {errors.phone && <p className="error">{errors.phone.message}</p>}
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { 
                            required: 'Email là bắt buộc',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email không hợp lệ'
                            }
                        })}
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="address">Địa chỉ:</label>
                    <input
                        id="address"
                        type="text"
                        {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                    />
                    {errors.address && <p className="error">{errors.address.message}</p>}
                </div>

                <div>
                    <label htmlFor="city">Tỉnh/Thành phố:</label>
                    <select
                        id="city"
                        {...register('city', { required: 'Tỉnh/Thành phố là bắt buộc' })}
                        onChange={handleCityChange}
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {cities.map(city => (
                            <option key={city.Id} value={JSON.stringify(city)}>{city.Name}</option>
                        ))}
                    </select>
                    {errors.city && <p className="error">{errors.city.message}</p>}
                </div>

                <div>
                    <label htmlFor="district">Quận/Huyện:</label>
                    <select
                        id="district"
                        {...register('district', { required: 'Quận/Huyện là bắt buộc' })}
                        onChange={handleDistrictChange}
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map(district => (
                            <option key={district.Id} value={district.Id}>{district.Name}</option>
                        ))}
                    </select>
                    {errors.district && <p className="error">{errors.district.message}</p>}
                </div>

                <div>
                    <label htmlFor="ward">Phường/Xã:</label>
                    <select
                        id="ward"
                        {...register('ward', { required: 'Phường/Xã là bắt buộc' })}
                    >
                        <option value="">Chọn phường/xã</option>
                        {wards.map(ward => (
                            <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
                        ))}
                    </select>
                    {errors.ward && <p className="error">{errors.ward.message}</p>}
                </div>

                <button type="submit">Đặt hàng</button>
            </form>
        </div>
    );
};

export default Checkout;
