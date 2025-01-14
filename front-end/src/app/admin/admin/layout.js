import "./public/bootstrap/css/bootstrap.min.css";
import "./public/css/style.css";
import "./public/css/fontawesome.css";
import Leftbar from "./components/leftbar";
import Link from "next/link";
import Providers from "@/redux/provider";

export const metadata = {
  title: 'Admin shopShoe',
  description: 'Trang quản lý bằng Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ background: "#f8f9fa" }}>
        <Providers>
          <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '280px' }} data-bs-theme="dark">
            <div className="d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none mt-5" style={{ height: '100px' }}>
                  <img src="/img/logo.jpg"  style={{ maxHeight: '250px', width: 'auto' }} />
              </div>
              <hr />
              <Leftbar />
            </div>

            {/* Main content */}
            <div className="w-100">
              {/* Navbar */}
              <nav className="navbar navbar-expand-md navbar-dark text-bg-dark">
                <div className="container-fluid ps-0">
                  <div className="d-flex justify-content-between w-100">
                    {/* Search Bar */}
                    <form className="d-flex w-100" role="search" data-bs-theme="light">
                      <div className="input-group">
                        <button type="submit" className="btn btn-primary">
                          <i className="far fa-search"></i>
                        </button>
                        <input className="form-control me-2" type="search" placeholder="Search" />
                      </div>
                    </form>
                    {/* Navbar Toggler */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                  </div>

                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto">

                      {/* User Profile */}
                      <li className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <strong>Admin</strong>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              {/* Main Content Area */}
              <div className="container-fluid p-4">
                {children}
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
