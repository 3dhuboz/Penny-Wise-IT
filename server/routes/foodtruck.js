const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');
const FoodOrder = require('../models/FoodOrder');
const CookDay = require('../models/CookDay');

// ═══════════════════════════════════════════
// MENU ITEMS
// ═══════════════════════════════════════════

// GET all menu items for the logged-in owner
router.get('/menu', auth, async (req, res) => {
  try {
    const items = await MenuItem.find({ owner: req.user._id }).sort({ category: 1, sortOrder: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load menu', error: err.message });
  }
});

// GET menu categories (distinct)
router.get('/menu/categories', auth, async (req, res) => {
  try {
    const cats = await MenuItem.distinct('category', { owner: req.user._id });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load categories', error: err.message });
  }
});

// POST create menu item
router.post('/menu', auth, async (req, res) => {
  try {
    const item = new MenuItem({ ...req.body, owner: req.user._id });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create item', error: err.message });
  }
});

// PUT update menu item
router.put('/menu/:id', auth, async (req, res) => {
  try {
    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update item', error: err.message });
  }
});

// DELETE menu item
router.delete('/menu/:id', auth, async (req, res) => {
  try {
    await MenuItem.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
});

// Toggle availability
router.patch('/menu/:id/toggle', auth, async (req, res) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.available = !item.available;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle', error: err.message });
  }
});

// ═══════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════

// GET orders for the logged-in owner
router.get('/orders', auth, async (req, res) => {
  try {
    const { status, limit = 50, skip = 0 } = req.query;
    const filter = { owner: req.user._id };
    if (status && status !== 'all') filter.status = status;
    const orders = await FoodOrder.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('cookDay', 'date title location');
    const total = await FoodOrder.countDocuments(filter);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orders', error: err.message });
  }
});

// GET order stats
router.get('/orders/stats', auth, async (req, res) => {
  try {
    const ownerId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [pending, preparing, todayOrders, monthOrders, monthRevenue] = await Promise.all([
      FoodOrder.countDocuments({ owner: ownerId, status: 'pending' }),
      FoodOrder.countDocuments({ owner: ownerId, status: 'preparing' }),
      FoodOrder.countDocuments({ owner: ownerId, createdAt: { $gte: today } }),
      FoodOrder.countDocuments({ owner: ownerId, createdAt: { $gte: thisMonth } }),
      FoodOrder.aggregate([
        { $match: { owner: ownerId, createdAt: { $gte: thisMonth }, 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    res.json({
      pending,
      preparing,
      todayOrders,
      monthOrders,
      monthRevenue: monthRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats', error: err.message });
  }
});

// POST create order (can be from admin or public storefront later)
router.post('/orders', auth, async (req, res) => {
  try {
    const order = new FoodOrder({ ...req.body, owner: req.user._id });
    // Calculate totals
    let subtotal = 0;
    for (const item of order.items) {
      const optionsExtra = (item.options || []).reduce((sum, o) => sum + (o.priceAdjust || 0), 0);
      item.subtotal = (item.unitPrice + optionsExtra) * item.quantity;
      subtotal += item.subtotal;
    }
    order.subtotal = subtotal;
    order.tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% GST
    order.total = Math.round((subtotal + order.tax) * 100) / 100;
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create order', error: err.message });
  }
});

// PUT update order status
router.put('/orders/:id/status', auth, async (req, res) => {
  try {
    const order = await FoodOrder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order', error: err.message });
  }
});

// PUT update payment status
router.put('/orders/:id/payment', auth, async (req, res) => {
  try {
    const update = { 'payment.status': req.body.status };
    if (req.body.status === 'paid') update['payment.paidAt'] = new Date();
    const order = await FoodOrder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      update,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update payment', error: err.message });
  }
});

// ═══════════════════════════════════════════
// COOK DAYS
// ═══════════════════════════════════════════

// GET cook days
router.get('/cookdays', auth, async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { owner: req.user._id };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const days = await CookDay.find(filter).sort({ date: 1 });

    // Attach order counts
    const dayIds = days.map(d => d._id);
    const orderCounts = await FoodOrder.aggregate([
      { $match: { cookDay: { $in: dayIds } } },
      { $group: { _id: '$cookDay', count: { $sum: 1 }, revenue: { $sum: '$total' } } }
    ]);
    const countMap = {};
    orderCounts.forEach(o => { countMap[o._id.toString()] = { count: o.count, revenue: o.revenue }; });

    const result = days.map(d => ({
      ...d.toObject(),
      orderCount: countMap[d._id.toString()]?.count || 0,
      revenue: countMap[d._id.toString()]?.revenue || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load cook days', error: err.message });
  }
});

// POST create cook day
router.post('/cookdays', auth, async (req, res) => {
  try {
    const day = new CookDay({ ...req.body, owner: req.user._id });
    await day.save();
    res.status(201).json(day);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create cook day', error: err.message });
  }
});

// PUT update cook day
router.put('/cookdays/:id', auth, async (req, res) => {
  try {
    const day = await CookDay.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!day) return res.status(404).json({ message: 'Cook day not found' });
    res.json(day);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update cook day', error: err.message });
  }
});

// DELETE cook day
router.delete('/cookdays/:id', auth, async (req, res) => {
  try {
    await CookDay.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({ message: 'Cook day deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete cook day', error: err.message });
  }
});

module.exports = router;
