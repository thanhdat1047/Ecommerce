import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import usersRoutes from "./user";
import cartRoutes from "./cart";
import orderRoutes from "./orders";

const rootRouter: Router = Router()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/products', productsRoutes)
rootRouter.use('/user',usersRoutes)
rootRouter.use('/carts', cartRoutes)
rootRouter.use('/orders', orderRoutes)
export default rootRouter;

/*
    1. user managerment
    - list users
    - get user by id
    - change user role
    2. order management
    - list all orders (filter on status)
    - change order status
    - list all orders of given user
    3. products
    - search api for products(for both user and admin) 
        -> full test search

*/