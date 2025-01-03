import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Lấy giá trị của token từ cookie
  const token = request.cookies.get('token');

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    // Nếu không có token, chuyển hướng đến trang đăng nhập
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Gọi đến API xác thực token
  const res = await fetch('http://localhost:3000/checktoken', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Kiểm tra phản hồi từ API
  if (!res.ok) {
    // Nếu token không hợp lệ, chuyển hướng đến trang đăng nhập
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu token hợp lệ, cho phép yêu cầu tiếp tục
  return NextResponse.next();
}

export const config = {
  matcher: '/info'
};
