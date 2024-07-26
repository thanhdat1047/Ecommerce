import { Request, Response, NextFunction, Router } from "express";
import { prismaClient } from "../index";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const createProduct = async(req:Request, res:Response)=> {
    // ["tea","india"] => "tea,india"
    // Create a validate to for this request
    const product = await prismaClient.product.create({
        data:{
            ...req.body,
            tags: req.body.tags.join(',') 
            
        }   
    })
    res.json(product)
    
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = req.body;
        if(product.tags){
            product.tags = product.tags.join(',')
        }
        const updateProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product 
        })
        res.json(updateProduct);

    } catch (error) {
        console.log(error);
        next(new NotFoundException('Product not found.', ErrorCodes.PRODUCT_NOT_FOUND));
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    //Assignment

}

export const listProducts = async (req: Request, res: Response) => {
    // {
    //     count: 100,
    //     data:[]
    // }

    const count = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip || 0,
        take: +req.query.take || 5,
    })

    res.json({
        data: products,
        count
    })
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product)
    } catch (error) {
        console.log(error);
        next(new NotFoundException('Product not found.', ErrorCodes.PRODUCT_NOT_FOUND));
    }

}

// export const searchProducts = async (req: Request, res:Response, next: NextFunction) =>{
//     const products = await prismaClient.product.findMany({
//         where:{
//             name:{
//                 search: req.query.q.toString()
//             },
//             description:{
//                 search: req.query.q.toString()
//             },
//             tags:{
//                 search: req.query.q.toString()
//             },
//         }
//     })
//     res.json(products)
// }