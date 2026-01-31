import express from 'express';
import { body } from 'express-validator';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getEmployees)
  .post(
    [
      body('name').trim().notEmpty().withMessage('Employee name is required'),
      validate,
    ],
    createEmployee
  );

router
  .route('/:id')
  .get(getEmployee)
  .put(
    [
      body('name').trim().notEmpty().withMessage('Employee name is required'),
      validate,
    ],
    updateEmployee
  )
  .delete(deleteEmployee);

export default router;
