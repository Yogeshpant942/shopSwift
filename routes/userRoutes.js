const express = require('express');
const { registerController, loginController, getUserProfileController, logOutUserProfile, updateUserProfile, updateUserPassword, uploadProfilePicture, passwordResetController } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddlewares');
const { singleUpload } = require('../middlewares/multer');
const router = express.Router();

router.post('/register',registerController);

router.post('/login',loginController);

router.get('/profile',isAuth,getUserProfileController);

router.get('/logout',logOutUserProfile);

router.put('/profile-update',isAuth,updateUserProfile);

router.put('/update-password',isAuth,updateUserPassword);

router.put('/update-picture',isAuth,singleUpload,uploadProfilePicture);

router.post('/reset-password',passwordResetController);

module.exports = router;
