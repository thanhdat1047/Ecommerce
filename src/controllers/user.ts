import { NotFoundException } from "../exceptions/not-found";
import { Request, Response } from "express";
import { AddressSchema, CreateAddressSchema } from "../schema/users";
import { ErrorCodes } from "../exceptions/root";
import { User } from "@prisma/client";
import { prismaClient } from "../index";

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