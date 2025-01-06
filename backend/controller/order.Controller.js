const Order = require('../model/order.Model');
const Voucher = require('../model/voucherModel');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const User = require('../model/user.Model');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "thienvvps34113@fpt.edu.vn",
        pass: "ffkv ivpg fhdy enaw",
    },
});

const invoicesDir = path.join(__dirname, '../invoices');
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
ensureDirectoryExists(invoicesDir);


// Create a new order and generate invoice
exports.createOrder = async (req, res) => {
    try {
      const orderDetails = req.body;
      let discountAmount = 0;
      let voucherId = null;
    if (orderDetails.voucher_code) {
        const voucher = await Voucher.findOne({ voucher_code: orderDetails.voucher_code, is_active: true });
          if (!voucher) {
            return res.status(404).json({ message: 'Voucher is not valid' });
        }
        if (voucher.min_order_amount > orderDetails.totalAmount) {
          return res.status(400).json({
            message: `Order does not meet minimum amount ${voucher.min_order_amount}`,
          });
        }
           if (voucher.max_uses && voucher.uses_count >= voucher.max_uses) {
               return res.status(400).json({message: 'Voucher has reached max uses'})
           }

        if (voucher.end_date && voucher.end_date < new Date()) {
          return res.status(400).json({ message: 'Voucher is expired' });
        }
        voucherId = voucher._id;

        if (voucher.discount_type === 'percentage') {
          discountAmount = (orderDetails.totalAmount * voucher.discount_value) / 100;
        } else if (voucher.discount_type === 'fixed amount') {
          discountAmount = voucher.discount_value;
        }

           voucher.uses_count += 1;
           await voucher.save();
      }
        const order = new Order({...orderDetails, discountAmount, voucher_id: voucherId});
        await order.save();


        // Create invoice PDF
        const fontPath = path.join(__dirname, '../fonts/Roboto-Regular.ttf');
        const doc = new PDFDocument({ margin: 50 });
        const invoicePath = path.join(invoicesDir, `invoice-${order._id}.pdf`);
        const writeStream = fs.createWriteStream(invoicePath);

        doc.pipe(writeStream);
        doc.font(fontPath);
        doc.fontSize(25).text('HÓA ĐƠN BÁN HÀNG', { align: 'center', underline: true });
        doc.moveDown(2);
        doc.fontSize(12).text(`Mã Đơn Hàng: ${order._id}`);
        doc.text(`Ngày Tạo: ${new Date(order.createdAt).toLocaleString('vi-VN')}`);
        doc.text(`Tổng Số Tiền: ${orderDetails.totalAmount.toLocaleString('vi-VN')} đ`);
        doc.text(`Phương Thức Thanh Toán: ${orderDetails.paymentMethod}`);
        doc.moveDown();
        doc.fontSize(12).text('Địa Chỉ Giao Hàng:', { underline: true });
        doc.text(`${orderDetails.shippingAddress.street}, ${orderDetails.shippingAddress.ward}`);
        doc.text(`${orderDetails.shippingAddress.district}, ${orderDetails.shippingAddress.city}`);
        doc.moveDown(2);
        doc.fontSize(12).text('Chi Tiết Đơn Hàng:', { underline: true });
        orderDetails.details.forEach((item, index) => {
            doc.moveDown(0.5);
            doc.text(`${index + 1}. Tên Sản Phẩm: ${item.name}`);
            doc.text(`   - Số Lượng: ${item.quantity}`);
            doc.text(`   - Giá: ${item.price.toLocaleString('vi-VN')} đ`);
        });
        doc.end();


        writeStream.on('finish', async () => {
            try {
                const user = await User.findById(orderDetails.userId);
                if (!user) {
                    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
                }
                const mailOptions = {
                    from: "thienvvps34113@fpt.edu.vn",
                    to: user.email,
                    subject: 'Xác Nhận Đơn Hàng',
                    text: `Cảm ơn bạn đã đặt hàng! Mã đơn hàng của bạn là ${order._id}.`,
                    attachments: [
                        {
                            filename: `invoice-${order._id}.pdf`,
                            path: invoicePath,
                        },
                    ],
                };
                await transporter.sendMail(mailOptions);
                res.status(201).json({ message: 'Đơn hàng đã được tạo, email đã được gửi!', order });
            } catch (emailError) {
                console.error('Lỗi gửi email:', emailError);
                res.status(500).json({ error: 'Gửi email thất bại' });
            }
        });

        writeStream.on('error', (err) => {
            console.error('Lỗi ghi PDF:', err);
            res.status(500).json({ error: 'Tạo hóa đơn PDF thất bại' });
        });
    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};


// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật đơn hàng
exports.updateOrder = async (req, res) => {
    try {
        const { userId, totalAmount, shippingAddress, paymentMethod, status, details } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                userId,
                totalAmount,
                shippingAddress,
                paymentMethod,
                status,
                details
            },
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật trạng thái
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully', updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDeliveredOrders = async (req, res) => {
    try {
        const deliveredOrders = await Order.find({ status: 'delivered' });
        res.json(deliveredOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivered orders', error });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const userId  = req.params.id
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ message: "Failed to fetch order history." });
    }
}
exports.getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({ totalOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tính tổng đơn hàng." });
    }
};
exports.getTotalIncome = async (req, res) => {
    try {
        const totalIncome = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        res.json({ total: totalIncome[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total income', error });
    }
};
exports.getOrdersByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const orders = await Order.find({ status });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders by status', error });
    }
};
exports.getOrdersByDate = async (req, res) => {
    const { date } = req.params;
    try {
        const orders = await Order.find({
            createdAt: {
                $gte: new Date(date),
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders by date', error });
    }
};
exports.getOrderCount = async (req, res) => {
    try {
        const count = await Order.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users count', error });
    }
};