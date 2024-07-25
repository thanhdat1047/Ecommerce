import authMiddleware from "../middlewares/auth";
import { errorHander } from "../error-handler";
import { Router } from "express";
import adminMiddleware from "../middlewares/admin";
import { cancelOrder, createOrder, getOrderById, listOrders } from "../controllers/order";

const orderRoutes:Router = Router();

orderRoutes.post('/', [authMiddleware],errorHander(createOrder));
orderRoutes.put('/:id/cancel', [authMiddleware],errorHander(cancelOrder));
orderRoutes.get('/', [authMiddleware],errorHander(listOrders));
orderRoutes.get('/:id', [authMiddleware],errorHander(getOrderById));

export default orderRoutes;