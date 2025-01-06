const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.Controller');


router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/lichsu/:id', orderController.getOrderHistory);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.put('/status/:orderId', orderController.updateOrderStatus)
router.delete('/:id', orderController.deleteOrder);

router.get('/delivered', orderController.getDeliveredOrders);
router.get('/total-orders', orderController.getTotalOrders);
router.get('/incomes/total', orderController.getTotalIncome);
router.get('/status/:status', orderController.getOrdersByStatus);
router.get('/date/:date', orderController.getOrdersByDate);
router.get('/count', orderController.getOrderCount);

module.exports = router;