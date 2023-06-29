import express from 'express';
import { getUser } from '../controllers/UserController.js';
import { Login, Logout, Register } from '../controllers/AuthenticateController.js';
import { refreshToken } from '../controllers/RefreshTokenController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { createIncome, deleteIncome, editIncome, getIncome, getIncomeId } from '../controllers/IncomeController.js';
import { createExpense, deleteExpense, editExpense, getExpense, getExpenseId } from '../controllers/ExpenseController.js';

const router = express.Router();

router.get('/user', verifyToken, getUser);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken)
router.delete('/logout', Logout);
router.get('/income', verifyToken, getIncome);
router.get('/income/:id', verifyToken, getIncomeId);
router.post('/income', verifyToken, createIncome);
router.patch('/income/:id', verifyToken, editIncome);
router.delete('/income/:id', verifyToken, deleteIncome);
router.get('/expense', verifyToken, getExpense);
router.get('/expense/:id', verifyToken, getExpenseId);
router.post('/expense', verifyToken, createExpense);
router.patch('/expense/:id', verifyToken, editExpense);
router.delete('/expense/:id', verifyToken, deleteExpense);


export default router;