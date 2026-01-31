import express from 'express';
import { body } from 'express-validator';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCustomers)
  .post(
    [
      body('name').trim().notEmpty().withMessage('Customer name is required'),
      body('phone').trim().notEmpty().withMessage('Phone number is required'),
      validate,
    ],
    createCustomer
  );

router
  .route('/:id')
  .get(getCustomer)
  .put(
    [
      body('name').trim().notEmpty().withMessage('Customer name is required'),
      body('phone').trim().notEmpty().withMessage('Phone number is required'),
      validate,
    ],
    updateCustomer
  )
  .delete(deleteCustomer);

export default router;
