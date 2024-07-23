import {Router} from 'express';
import { me, signin, signup } from '../controllers/auth';
import { errorHander } from '../error-handler';
import authMiddleware from '../middlewares/auth';

const authRoutes = Router();

authRoutes.post('/signup',errorHander(signup)); 
authRoutes.post('/signin',errorHander(signin)); 
authRoutes.get('/me', [authMiddleware], errorHander(me));
export default authRoutes;