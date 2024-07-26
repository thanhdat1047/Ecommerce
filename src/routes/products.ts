import authMiddleware from "../middlewares/auth";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import { errorHander } from "../error-handler";
import { Router } from "express";
import adminMiddleware from "../middlewares/admin";

const productsRoutes:Router = Router();

productsRoutes.post('/', [authMiddleware, adminMiddleware],errorHander(createProduct));
productsRoutes.put('/:id', [authMiddleware, adminMiddleware],errorHander(updateProduct));
productsRoutes.delete('/:id', [authMiddleware, adminMiddleware],errorHander(deleteProduct));
productsRoutes.get('/', [authMiddleware, adminMiddleware],errorHander(listProducts));
//productsRoutes.get('/products/search', [authMiddleware, adminMiddleware],errorHander(searchProducts));
productsRoutes.get('/:id', [authMiddleware, adminMiddleware],errorHander(getProductById));

// /search?q=""
export default productsRoutes;