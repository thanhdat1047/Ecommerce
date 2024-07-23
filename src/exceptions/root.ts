// message, status code, error codes, error

import exp from "constants";

export class HttpException extends Error {
    message: string;
    errorCode: ErrorCodes;
    statusCode:number;
    errors: any;

    constructor(message:string, errorCode: ErrorCodes, statusCode:number, errors: any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors
    }
}

export enum ErrorCodes {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS =1002,
    INCORRECT_PASSWORD =1003,
    EMAIL_AND_PASSWORD_ARE_REQUIRE = 1004,
    SERVER_ERROR = 1005,
    UNPROCESSABE_ENTITY = 2001,
    UNAUTHORIZED = 2002,
    INTERNAL_EXCEPTION= 3001,
}