import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Customer from '../src/models/Customer.js';
import Employee from '../src/models/Employee.js';
import Category from '../src/models/Category.js';
import Item from '../src/models/Item.js';
import Order from '../src/models/Order.js';

let token;
let userId;
let customerId;
let employeeId;
let itemId;

describe('Order API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quotation_test');

    // Create test user
    const user = await User.create({
      name: 'Order Test User',
      email: 'order-test@example.com',
      password: 'password123',
    });
    userId = user._id;

    // Login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'order-test@example.com',
        password: 'password123',
      });
    token = res.body.data.token;

    // Create test customer
    const customer = await Customer.create({
      name: 'Order Customer',
      phone: '9876543210',
      createdBy: userId,
    });
    customerId = customer._id;

    // Create test employee
    const employee = await Employee.create({
      name: 'Order Employee',
      createdBy: userId,
    });
    employeeId = employee._id;

    // Create category and item
    const category = await Category.create({
      name: 'Test Category',
      createdBy: userId,
    });

    const item = await Item.create({
      name: 'Test Item',
      price: 1000,
      category: category._id,
      createdBy: userId,
    });
    itemId = item._id;
  });

  afterAll(async () => {
    await Order.deleteMany({});
    await Item.deleteMany({});
    await Category.deleteMany({});
    await Employee.deleteMany({});
    await Customer.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    it('should create a new order with GST', async () => {
      const orderData = {
        customerId: customerId.toString(),
        employeeId: employeeId.toString(),
        items: [
          {
            itemId: itemId.toString(),
            quantity: 2,
            price: 1000,
          },
        ],
        gstEnabled: true,
        notes: 'Test order',
      };

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subtotal).toBe(2000);
      expect(res.body.data.gstAmount).toBe(360); // 18% of 2000
      expect(res.body.data.total).toBe(2360);
      expect(res.body.data.orderNumber).toMatch(/^ORD-/);
    });

    it('should create order without GST', async () => {
      const orderData = {
        customerId: customerId.toString(),
        items: [
          {
            itemId: itemId.toString(),
            quantity: 1,
            price: 1500,
          },
        ],
        gstEnabled: false,
      };

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subtotal).toBe(1500);
      expect(res.body.data.gstAmount).toBe(0);
      expect(res.body.data.total).toBe(1500);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should require at least one item', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customerId: customerId.toString(),
          items: [],
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/orders', () => {
    it('should get all orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      const order = await Order.create({
        customer: customerId,
        customerName: 'Order Customer',
        items: [
          {
            item: itemId,
            itemName: 'Test Item',
            quantity: 1,
            price: 1000,
            total: 1000,
          },
        ],
        subtotal: 1000,
        gstEnabled: false,
        gstAmount: 0,
        total: 1000,
        createdBy: userId,
      });
      orderId = order._id;
    });

    it('should get order by ID', async () => {
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(1000);
    });
  });

  describe('PUT /api/orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      const order = await Order.create({
        customer: customerId,
        customerName: 'Order Customer',
        items: [
          {
            item: itemId,
            itemName: 'Test Item',
            quantity: 1,
            price: 1000,
            total: 1000,
          },
        ],
        subtotal: 1000,
        total: 1000,
        createdBy: userId,
      });
      orderId = order._id;
    });

    it('should update order status', async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'confirmed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('confirmed');
    });

    it('should validate status enum', async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid-status' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      const order = await Order.create({
        customer: customerId,
        customerName: 'Order Customer',
        items: [
          {
            item: itemId,
            itemName: 'Test Item',
            quantity: 1,
            price: 1000,
            total: 1000,
          },
        ],
        subtotal: 1000,
        total: 1000,
        createdBy: userId,
      });
      orderId = order._id;
    });

    it('should delete order', async () => {
      const res = await request(app)
        .delete(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const order = await Order.findById(orderId);
      expect(order).toBeNull();
    });
  });
});
