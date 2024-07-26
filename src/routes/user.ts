import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/user";
import { errorHander } from "../error-handler";
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const usersRoutes : Router = Router()

usersRoutes.post('/address',[authMiddleware],errorHander(addAddress))
usersRoutes.delete('/address/:id',[authMiddleware], errorHander(deleteAddress))
usersRoutes.get('/address',[authMiddleware], errorHander(listAddress))
usersRoutes.put('/',[authMiddleware], errorHander(updateUser))
// admin
usersRoutes.put("/:id/role",[authMiddleware, adminMiddleware], errorHander(changeUserRole))
usersRoutes.get('/',[authMiddleware,adminMiddleware], errorHander(listUsers))
usersRoutes.get('/:id',[authMiddleware,adminMiddleware], errorHander(getUserById))

export default usersRoutes;
