const express = require('express');
const router = express.Router();
const {
  addCategory,
  addAllCategory,
  getAllCategory,
  getAllCategories,
  getShowingCategory,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  updateManyCategory
} = require('../controller/categoryController');
const { adminOnly } = require('../config/auth');

// Public storefront read
router.get('/show', getShowingCategory);
router.get('/slug/:slug', getCategoryBySlug);

// Admin-only category management
router.post('/add', adminOnly, addCategory);
router.post('/add/all', adminOnly, addAllCategory);
router.get('/', adminOnly, getAllCategory);
router.get('/all', adminOnly, getAllCategories);
router.get('/:id', adminOnly, getCategoryById);
router.put('/:id', adminOnly, updateCategory);
router.put('/status/:id', adminOnly, updateStatus);
router.delete('/:id', adminOnly, deleteCategory);
router.patch('/delete/many', adminOnly, deleteManyCategory);
router.patch('/update/many', adminOnly, updateManyCategory);

module.exports = router;
