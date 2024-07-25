import authMiddleware from "../middlewares/auth";
import { errorHander } from "../error-handler";
import { Router } from "express";
import adminMiddleware from "../middlewares/admin";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";

const cartRoutes:Router = Router();

cartRoutes.post('/', [authMiddleware],errorHander(addItemToCart));
cartRoutes.put('/:id', [authMiddleware],errorHander(changeQuantity));
cartRoutes.delete('/:id', [authMiddleware],errorHander(deleteItemFromCart));
cartRoutes.get('/', [authMiddleware],errorHander(getCart));

export default cartRoutes;