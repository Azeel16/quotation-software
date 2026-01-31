import express from 'express';
import { body } from 'express-validator';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getItems)
  .post(
    [
      body('name').trim().notEmpty().withMessage('Item name is required'),
      body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
      body('category').notEmpty().withMessage('Category is required'),
      validate,
    ],
    createItem
  );

router
  .route('/:id')
  .get(getItem)
  .put(
    [
      body('name').trim().notEmpty().withMessage('Item name is required'),
      body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
      body('category').notEmpty().withMessage('Category is required'),
      validate,
    ],
    updateItem
  )
  .delete(deleteItem);

export default router;
