import { NotFoundException } from "../exceptions/not-found";
import { Request, Response, NextFunction } from "express";
import { AddressSchema, CreateAddressSchema, UpdateUserSchema } from "../schema/users";
import { ErrorCodes } from "../exceptions/root";
import { Address, User } from "@prisma/client";
import { prismaClient } from "../index";
import { BadRequestsException } from "../exceptions/bad-request";

export const addAddress = async (req: Request, res:Response)=>{
    CreateAddressSchema.parse(req.body)
    const address = await prismaClient.address.create({
        data:{
            ...req.body,
            userId: req.user.id
        }
    })
    res.json(address)
}
export const deleteAddress = async(req: Request, res:Response)=>{
    try {
        await prismaClient.address.delete({
            where:{
                id: +req.params.id
            }
        })
        res.json({success: true})
    } catch (error) {
        throw new NotFoundException('Address not found.' , ErrorCodes.ADDRESS_NOT_FOUND)
    }
}
export const listAddress = async(req: Request, res:Response)=>{
    const addresses = await prismaClient.address.findMany({
        where:{
            userId: req.user.id
        }
    })
    res.json(addresses);
}

export const updateUser = async (req:Request, res: Response, next: NextFunction) => {
    const validatedDate = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    if(validatedDate.defaultShippingAddress){
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedDate.defaultShippingAddress
                }
            })
        }catch(error){
            throw new NotFoundException('Address not found', ErrorCodes.ADDRESS_NOT_FOUND);
        }
        if(shippingAddress.userId != req.user.id){
            next( new  BadRequestsException('Address does not belong to user', ErrorCodes.ADDRESS_DOES_NOT_BELONG));
        }
    }
    if(validatedDate.defaultBillingAddress){
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedDate.defaultBillingAddress
                }
            })
            
        }catch(error){
            throw new NotFoundException('Address not found', ErrorCodes.ADDRESS_NOT_FOUND);
        }
        if(billingAddress.userId != req.user.id){
            next( new  BadRequestsException('Address does not belong to user', ErrorCodes.ADDRESS_DOES_NOT_BELONG));
        }
    }
    const updatedUser = await prismaClient.user.update({
        where:{
            id: req.user.id
        },
        data:validatedDate
    })
    res.json(updateUser);
}