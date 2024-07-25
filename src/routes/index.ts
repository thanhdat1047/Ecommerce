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