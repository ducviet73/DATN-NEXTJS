const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  voucher_code: { type: String, required: true, unique: true },
  discount_type: { type: String, enum: ['percentage', 'fixed amount'], required: true },
  discount_value: { type: Number, required: true },
  min_order_amount: { type: Number, default: 0 },
  start_date: { type: Date },
  end_date: { type: Date },
  max_uses: { type: Number },
  uses_count: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;