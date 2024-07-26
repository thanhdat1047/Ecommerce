import { Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../index";
import { ChangeQuantitySchema, CreateCartItemSchema } from "../schema/cart";
import { BadRequestsException } from "../exceptions/bad-request";
import { UnauthorizedException } from "../exceptions/unathorized";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    //1. to create a transaction
    //2. to list all the cart items and proceed if cart is not empty
    //3. calculate the total amount
    //4. fetch address of user
    //5. to define computed field for formatted address on address module
    //6. createa a order and orderproduct
    //7. create event
    //8. to empty the cart
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })
        if (cartItems.length == 0) {
            return res.json({ message: "cart is empty" })
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0);
        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress
            }
        })
        const order = await tx.order.create({
            data: {
                userId: req.user.id as number,
                netAmount: price as number,
                address: address.formattedAddress,
                status: "PENDING",
                orderProduct: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }

            }
        })
        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        })
        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        })
        return res.json({
            data: order,
            orderEvent
        })
    })
}
export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders  = await prismaClient.order.findMany({
        where:{
            userId: req.user.id
        },
    })
    res.json(orders)
}
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    // 1. wrap it insiden tranaction
    // 2. check if the users is cancelling its own order
    return await prismaClient.$transaction(async (tx) => {
        try {
            const order = await tx.order.findFirstOrThrow({
                where:{
                    id: +req.params.id
                }
            })
            if(order.userId != req.user.id){
                next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED,null))
            }
            const newoder = await tx.order.update({
                where:{
                    id: +req.params.id
                },
                data:{
                    status: "CANCELLED"
                }
            })
            
            await tx.orderEvent.updateMany({
                where:{
                    orderId: +newoder.id
                },
                data:{
                    orderId: order.id,
                    status: "CANCELLED"
                }
            })
            return res.json(newoder)
        } catch (error) {
            next(new NotFoundException('Order not found', ErrorCodes.ORDER_NOT_FOUND))
        }
    })
    
}
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include:{
                orderProduct: true,
                event:true,
            }
        })
        res.json(order)
    } catch (error) {
        next(new NotFoundException('Order not found', ErrorCodes.ORDER_NOT_FOUND))
    }
}