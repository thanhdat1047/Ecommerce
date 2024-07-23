import {Router} from 'express';
import { signin, signup } from '../controllers/auth';
import { errorHander } from '../error-handler';

const authRoutes = Router();

authRoutes.post('/signup',errorHander(signup)); 
authRoutes.post('/signin',errorHander(signin)); 
export default authRoutes;