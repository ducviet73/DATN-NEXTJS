"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Leftbar() {
    const pathname = usePathname();

    return (
        <div className="d-flex flex-column p-3 bg-dark text-white" style={{ minHeight: "100vh", width: "250px" }}>
            <ul className="nav flex-column mb-auto">
                <li className="nav-item">
                    <Link href="/admin" className={`nav-link rounded-0 py-2 px-3 ${pathname == "/admin" ? "bg-white text-black" : "text-white"} d-flex align-items-center`}>
                        <i className="fas fa-tachometer-alt fa-fw me-2"></i>
                        <span className="d-none d-sm-inline-block">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/order" className={`nav-link rounded-0 py-2 px-3 ${pathname == "/admin/order" ? "bg-white text-black" : "text-white"} d-flex align-items-center`}>
                        <i className="fas fa-shopping-cart fa-fw me-2"></i>
                        <span className="d-none d-sm-inline-block">Đặt Hàng</span>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/product" className={`nav-link rounded-0 py-2 px-3 ${pathname == "/admin/product" ? "bg-white text-black" : "text-white"} d-flex align-items-center`}>
                        <i className="fas fa-boxes fa-fw me-2"></i>
                        <span className="d-none d-sm-inline-block">Sản Phẩm</span>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/vouchers" className={`nav-link rounded-0 py-2 px-3 ${pathname == "/admin/vouchers" ? "bg-white text-black" : "text-white"} d-flex align-items-center`}>
                        <i className="fas fa-boxes fa-fw me-2"></i>
                        <span className="d-none d-sm-inline-block">Vouchers</span>
                    </Link>
                </li>
                <li>
                    <Link href="/admin/users" className={`nav-link rounded-0 py-2 px-3 ${pathname == "/admin/users" ? "bg-white text-black" : "text-white"} d-flex align-items-center`}>
                        <i className="fas fa-users fa-fw me-2"></i>
                        <span className="d-none d-sm-inline-block">Người Dùng</span>
                    </Link>
                </li>
                {/* You can add the ratings section back if needed */}
                {/* <li>
                    <Link href="/admin/rating" className={`nav-link rounded-0 py-2 px-3 ${pathname == "/admin/rating" ? "bg-primary text-white" : "text-white"} d-flex align-items-center`}>
                        <i className="fas fa-star-half-alt me-2"></i>
                        <span className="d-none d-sm-inline-block">Ratings</span>
                    </Link>
                </li> */}
            </ul>
        </div>
    );
}
