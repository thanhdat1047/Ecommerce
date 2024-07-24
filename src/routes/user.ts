import { addAddress, deleteAddress, listAddress } from "../controllers/user";
import { errorHander } from "../error-handler";
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const usersRoutes : Router = Router()

usersRoutes.post('/address',[authMiddleware],errorHander(addAddress))
usersRoutes.delete('/address/:id',[authMiddleware], errorHander(deleteAddress))
usersRoutes.get('/address',[authMiddleware], errorHander(listAddress))

export default usersRoutes;
