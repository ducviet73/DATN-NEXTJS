export default function RecentOder(props) {
    const order = props.ordoer;
    return (
        <>
            <div className="d-flex text-body-secondary pt-3">
                <div className="p-2 me-2 bg-warning text-white">
                    <i className="fal fa-receipt"></i>
                </div>
                <a href="#" className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary">
                    <strong className="d-flex justify-content-between">
                        Đơn #{order._id}
                        <div>
                            <span className="badge text-bg-warning">
                                <i className="far fa-box"></i> {order.totalProduct}
                            </span>
                            <span className="badge bg-success-subtle text-success"><i className="far fa-money-bill-wave"></i> {order.totalMoney.tolocaleString()}</span>
                        </div>
                    </strong>
                    Đặt bởi <i>{order.user.fullname}</i> lúc {order.create_at}
                </a>
            </div>
            <div className="d-flex text-body-secondary pt-3">
                <div className="p-2 me-2 bg-success text-white">
                    <i className="fal fa-receipt"></i>
                </div>
                <a href="#" className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary">
                    <strong className="d-flex justify-content-between">
                        Đơn #122
                        <div>
                            <span className="badge text-bg-warning">
                                <i className="far fa-box"></i> 5
                            </span>
                            <span className="badge bg-success-subtle text-success"><i className="far fa-money-bill-wave"></i> 10,000,000</span>
                        </div>
                    </strong>
                    Đặt bởi <i>Khách vãng lai</i> lúc 18:00 04/06/2024
                </a>
            </div>
            <div className="d-flex text-body-secondary pt-3">
                <div className="p-2 me-2 bg-danger text-white">
                    <i className="fal fa-receipt"></i>
                </div>
                <a href="#" className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary">
                    <strong className="d-flex justify-content-between">
                        Đơn #121
                        <div>
                            <span className="badge text-bg-warning">
                                <i className="far fa-box"></i> 5
                            </span>
                            <span className="badge bg-success-subtle text-success"><i className="far fa-money-bill-wave"></i> 10,000,000</span>
                        </div>
                    </strong>
                    Đặt bởi <i>Khách vãng lai</i> lúc 18:00 04/06/2024
                </a>
            </div>
        </>
    )
}