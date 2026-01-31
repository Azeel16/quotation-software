import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Customer from '../src/models/Customer.js';

let token;
let userId;

describe('Customer API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quotation_test');

    // Create test user and get token
    const user = await User.create({
      name: 'Test User',
      email: 'customer-test@example.com',
      password: 'password123',
    });
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer-test@example.com',
        password: 'password123',
      });

    token = res.body.data.token;
  });

  afterAll(async () => {
    await Customer.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const customer = {
        name: 'Acme Corp',
        phone: '9876543210',
        gst: '27AABCU9603R1ZM',
        address: '123 Business St',
      };

      const res = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .send(customer);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(customer.name);
      expect(res.body.data.phone).toBe(customer.phone);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/customers')
        .send({ name: 'Test', phone: '1234567890' });

      expect(res.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Only' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/customers', () => {
    it('should get all customers', async () => {
      const res = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should search customers by name', async () => {
      const res = await request(app)
        .get('/api/customers?search=Acme')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/customers/:id', () => {
    let customerId;

    beforeAll(async () => {
      const customer = await Customer.create({
        name: 'Test Customer',
        phone: '1234567890',
        createdBy: userId,
      });
      customerId = customer._id;
    });

    it('should get customer by ID', async () => {
      const res = await request(app)
        .get(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Customer');
    });

    it('should return 404 for invalid ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/customers/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/customers/:id', () => {
    let customerId;

    beforeAll(async () => {
      const customer = await Customer.create({
        name: 'Update Test',
        phone: '9999999999',
        createdBy: userId,
      });
      customerId = customer._id;
    });

    it('should update customer', async () => {
      const updates = {
        name: 'Updated Name',
        phone: '8888888888',
        address: 'New Address',
      };

      const res = await request(app)
        .put(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updates.name);
      expect(res.body.data.phone).toBe(updates.phone);
    });
  });

  describe('DELETE /api/customers/:id', () => {
    let customerId;

    beforeAll(async () => {
      const customer = await Customer.create({
        name: 'Delete Test',
        phone: '7777777777',
        createdBy: userId,
      });
      customerId = customer._id;
    });

    it('should delete customer', async () => {
      const res = await request(app)
        .delete(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const customer = await Customer.findById(customerId);
      expect(customer).toBeNull();
    });
  });
});
