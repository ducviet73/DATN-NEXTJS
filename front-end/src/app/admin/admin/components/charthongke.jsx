"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CharThongKe() {
    const [incomeStatistics, setIncomeStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch dữ liệu từ API
        const fetchStatistics = async () => {
            try {
                const response = await fetch("http://localhost:3000/orders/incomes/statistics?year=2024&month=12"); // Đường dẫn API
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setIncomeStatistics(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const chartData = {
        labels: incomeStatistics.map((stat) => `${stat._id.day}/${stat._id.month}/${stat._id.year}`), // Ngày tháng năm
        datasets: [
            {
                label: "Doanh Thu (VNĐ)",
                data: incomeStatistics.map((stat) => stat.total), // Giá trị doanh thu
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Thống Kê Doanh Thu (Theo Ngày)",
            },
        },
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center text-white">Thống Kê Doanh Thu</h1>
            {loading ? (
                <p className="text-center text-white">Đang tải dữ liệu...</p>
            ) : error ? (
                <p className="text-center text-danger">Lỗi: {error}</p>
            ) : (
                <div className="chart-container" style={{ position: "relative", height: "400px", width: "100%" }}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
}
