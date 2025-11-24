import { Router } from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddlewares.js';
import { changeOrderStatusController, createOrderCategory, getMyOrdersControllers, getMySingleOrder, paymentController } from '../controllers/orderController.js';

const router = Router();

router.post('/create', isAuth, createOrderCategory);
router.get('/my-orders', isAuth, getMyOrdersControllers);
router.get('/my-orders/:id', isAuth, getMySingleOrder);
router.post('/payments', isAuth, paymentController);


router.get('/admin/get-all-orders', isAuth, isAdmin);

//change order status
router.put('/admin/order/:id',isAuth,isAdmin,changeOrderStatusController);

export default router;
