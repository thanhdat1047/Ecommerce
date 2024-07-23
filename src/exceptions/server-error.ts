import { ErrorCodes, HttpException } from "./root";

export class ServerError extends HttpException{
    constructor(message:string, errorCode:ErrorCodes ){
        super(message,errorCode, 500,null);
    }
}