import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import usersRoutes from "./user";

const rootRouter: Router = Router()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/products', productsRoutes)
rootRouter.use('/user',usersRoutes)
export default rootRouter;