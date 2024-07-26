import { CartItem, Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../index";
import { ChangeQuantitySchema, CreateCartItemSchema } from "../schema/cart";
import { UnauthorizedException } from "../exceptions/unathorized";
import { BadRequestsException } from "../exceptions/bad-request";

export const addItemToCart = async (req: Request, res: Response, next: NextFunction)=>{
    //Check for the existence of the sane prodcut in user's cart
    //and alter the quantity as required
    const validateData = CreateCartItemSchema.parse(req.body)
    let product : Product
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where:{
                id: validateData.productId
            }
        })
    } catch (error) {
        next(new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND))
    }
    const IsExistsCartItem = await prismaClient.cartItem.findFirst({
        where:{
            productId: product.id
        }
    })
    if(IsExistsCartItem){
        next (new BadRequestsException('Product had been add in your cart', ErrorCodes.PRODUCT_REALDY_EXISTS))
    }
    else{
        const cart = await prismaClient.cartItem.create({
            data: {
                userId: req.user.id,
                productId: product.id,
                quantity: validateData.quantity
            }
        })
        res.json(cart)
    }
    
}
export const deleteItemFromCart = async (req: Request, res: Response)=>{
    //check if user is delete its own cart item
    await prismaClient.cartItem.delete({
        where:{
            id: +req.params.id
        }
    })
    res.json({success:true})
}
export const changeQuantity = async (req: Request, res: Response, next: NextFunction)=>{
    //check if user is updating its own cart item
    const validateData = ChangeQuantitySchema.parse(req.body)
    return await prismaClient.$transaction(async(tx) =>{
        let cart : CartItem
        //check own car
        try {
            cart = await tx.cartItem.findFirst({
                where:{
                    id: +req.params.id
                }
            })
        } catch (error) {
            next (new NotFoundException('Cart item is not found', ErrorCodes.CART_ITEM_NOT_FOUND))
        }
        console.log(cart.userId, req.user.id);
        
        if(cart.userId != req.user.id){
            next (new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED, null))
        }
        const updatedCart = await tx.cartItem.update({
            where: {
                id: +req.params.id
            },
            data:{
               quantity: validateData.quantity  
            }
        })
        res.json(updatedCart)
    })
}
export const getCart = async (req: Request, res: Response)=>{
    const carts = await prismaClient.cartItem.findMany({
        where:{
            userId: req.user.id
        },
        include: {
            product: true
        }
    })
    res.json(carts)
}