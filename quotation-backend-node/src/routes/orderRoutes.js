import express from 'express';
import { body } from 'express-validator';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getOrders)
  .post(
    [
      body('customerId').notEmpty().withMessage('Customer is required'),
      body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
      body('items.*.itemId').notEmpty().withMessage('Item ID is required'),
      body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
      body('items.*.price')
        .isFloat({ min: 0 })
        .withMessage('Price must be positive'),
      validate,
    ],
    createOrder
  );

router
  .route('/:id')
  .get(getOrder)
  .put(
    [
      body('status')
        .optional()
        .isIn(['draft', 'pending', 'confirmed', 'cancelled', 'completed'])
        .withMessage('Invalid status'),
      validate,
    ],
    updateOrder
  )
  .delete(deleteOrder);

export default router;
