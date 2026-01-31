import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(
    [
      body('name').trim().notEmpty().withMessage('Category name is required'),
      validate,
    ],
    createCategory
  );

router
  .route('/:id')
  .put(
    [
      body('name').trim().notEmpty().withMessage('Category name is required'),
      validate,
    ],
    updateCategory
  )
  .delete(deleteCategory);

export default router;
