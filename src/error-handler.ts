import { ZodError } from "zod"
import { InternalException } from "./exceptions/internal-exception"
import { ErrorCodes, HttpException } from "./exceptions/root"
import { Request, Response , NextFunction} from "express"
import { BadRequestsException } from "./exceptions/bad-request"
export const errorHander = (method: Function) =>{
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch (error: any) {
            console.log('Error handler',error);
            let exception: HttpException;
            if(error instanceof HttpException){
                console.log("HttpException");
                
                exception = error;
            }else{
                if( error instanceof ZodError){
                    new BadRequestsException('Unprocessable entity',ErrorCodes.UNPROCESSABE_ENTITY)
                }
                exception = new InternalException('Something went wrong', error, ErrorCodes.INTERNAL_EXCEPTION)
            }
            next(exception); 
        }
    }
}