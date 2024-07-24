import { JWT_SECRET } from "../sercets";
import { ErrorCodes } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unathorized";
import { NextFunction, Response,Request } from "express";
import * as jwt from 'jsonwebtoken';
import { prismaClient } from "../index";
const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>{
     //1. Extract the token form header
    //const token = req.headers['authorization'];
    const authHeader = req.headers['authorization'];
     //2. If token is not presen, throw an error of unauthorized
    if(!authHeader){
        next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
    }
    try {
        
        //3. If the token is presen, vetify that token and extract the payload
        const token = authHeader.split(' ')[1]
        
        const payload = jwt.verify(token,JWT_SECRET) as {userId: number};

        //4. To get the user from the payload
        const user = await prismaClient.user.findFirst({where:{id:payload.userId}})
        if(!user){

            next(new UnauthorizedException('Unathorized', ErrorCodes.USER_NOT_FOUND))
        }
        //5. To attach the user to the current request object
        req.user = user; 
        next();

    } catch (error) {
        console.log(error);
        
        next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
    }
   
}

export default authMiddleware;