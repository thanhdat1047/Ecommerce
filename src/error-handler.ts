import { InternalException } from "./exceptions/internal-exception"
import { ErrorCodes, HttpException } from "./exceptions/root"
import { Request, Response , NextFunction} from "express"
export const errorHander = (method: Function) =>{
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch (error: any) {
            console.log(error);
            let exception: HttpException;
            if(error instanceof HttpException){
                exception = error;
            }else{
                exception = new InternalException('Something went wrong', error, ErrorCodes.INTERNAL_EXCEPTION)
            }
            next(exception); 
        }
    }
}