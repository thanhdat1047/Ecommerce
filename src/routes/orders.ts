import authMiddleware from "../middlewares/auth";
import { errorHander } from "../error-handler";
import { Router } from "express";
import adminMiddleware from "../middlewares/admin";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrder, listOrders, listUserOrders } from "../controllers/order";

const orderRoutes:Router = Router();

orderRoutes.post('/', [authMiddleware],errorHander(createOrder));
orderRoutes.put('/:id/cancel', [authMiddleware],errorHander(cancelOrder));
orderRoutes.get('/', [authMiddleware],errorHander(listOrders));

//admin 
orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHander(listAllOrder));
orderRoutes.get('/users/:id',[authMiddleware, adminMiddleware], errorHander(listUserOrders));
orderRoutes.put('/:id/status',[authMiddleware, adminMiddleware], errorHander(changeStatus));

orderRoutes.get('/:id', [authMiddleware],errorHander(getOrderById));
export default orderRoutes;