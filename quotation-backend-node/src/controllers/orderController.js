import Order from '../models/Order.js';
import Item from '../models/Item.js';
import Customer from '../models/Customer.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name phone')
      .populate('employee', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone gst address')
      .populate('employee', 'name')
      .populate('items.item', 'name unit');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { customerId, employeeId, items, gstEnabled, notes } = req.body;

    // Verify customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    // Process items with full details
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const itemDoc = await Item.findById(item.itemId);
      if (!itemDoc) {
        return res.status(404).json({
          success: false,
          error: `Item with id ${item.itemId} not found`,
        });
      }

      const itemTotal = item.quantity * item.price;
      subtotal += itemTotal;

      orderItems.push({
        item: itemDoc._id,
        itemName: itemDoc.name,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      });
    }

    // Calculate GST and total
    const gstAmount = gstEnabled ? subtotal * 0.18 : 0;
    const total = subtotal + gstAmount;

    // Create order
    const order = await Order.create({
      customer: customerId,
      customerName: customer.name,
      employee: employeeId || null,
      items: orderItems,
      subtotal,
      gstEnabled,
      gstAmount,
      total,
      notes,
      createdBy: req.user.id,
    });

    await order.populate('customer', 'name phone');
    await order.populate('employee', 'name');

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    )
      .populate('customer', 'name phone')
      .populate('employee', 'name');

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    await order.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
