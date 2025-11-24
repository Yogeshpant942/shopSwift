const express = require('express');
const { isAuth } = require('../middlewares/authMiddlewares.js');
const { createCategory, getAllCategory, deleteCategoryController } = require('../controllers/categoryController.js');

const router = express.Router();

router.post('/create', isAuth, isAdmin,createCategory);

router.get('/get-all',getAllCategory);
router.delete('/delete/:id',isAuth,isAdmin,deleteCategoryController);

module.exports = router;
