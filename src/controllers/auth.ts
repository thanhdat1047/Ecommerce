import express, {Request, Response, NextFunction} from 'express';
import { prismaClient } from '../index';
import {compareSync, hashSync} from 'bcrypt'
import* as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../sercets';
import { BadRequestsException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';
import { ServerError } from '../exceptions/server-error';
import { UnprocessableEntity } from '../exceptions/validation';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';
export const signup = async (req: Request ,res: Response, next: NextFunction) =>{
    SignUpSchema.parse(req.body);
    const {email ,password, name}  = req.body;
    let user = await prismaClient.user.findFirst({
        where:{email}
    }); 

    if(user){
        next(new BadRequestsException('User already', ErrorCodes.USER_ALREADY_EXISTS));
    }
    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password: hashSync(password,10)
        }
    })
    res.status(200).json({
        data:user,
        message:'Create success',
    }).end();
}

export const signin = async (req:Request, res:Response, next: NextFunction) =>{
        const {email,password} = req.body;
        let user = await prismaClient.user.findFirst({where:{email}})
        if(!user){
            next( new NotFoundException('User are not found', ErrorCodes.USER_NOT_FOUND));
        }
        if(!compareSync(password,user.password))
        {
            next(new BadRequestsException('Incorrect password', ErrorCodes.INCORRECT_PASSWORD));
        }else{
            const token = jwt.sign({
                userId: user.id, 
                
            },JWT_SECRET)
    
            res.status(200).json({
                user,
                token
            })
        }
}
