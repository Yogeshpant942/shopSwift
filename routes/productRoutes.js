const express = require('express');
const { getAllProductController, getSingleProduct, createProductController, updateProductController, updateProductImageController, deleteProductController, deleteProductImageController, productReviewController, getTopProductController } = require('../controllers/productController');
const { isAuth } = require('../middlewares/authMiddlewares.js');
const { singleUpload } = require('../middlewares/multer.js');

const router = express.Router();

router.get('/get-all', getAllProductController);

router.get('/top', getTopProductController);

router.get('/:id',getSingleProduct);

router.post('/create',isAuth,isAdmin,singleUpload, createProductController);

//update product
router.put('/:id',isAuth,isAdmin,updateProductController);

//update product image
router.put('/image/:id',isAuth,isAdmin,singleUpload,updateProductImageController);

//delete image
router.put('/delete/:id',isAuth,isAdmin,deleteProductImageController)
//delete product
router.put('/:id',isAuth,isAdmin,deleteProductController)

//review product

router.put('/:id/review',isAuth,productReviewController)

module.exports = router;
