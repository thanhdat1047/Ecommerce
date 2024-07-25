import { z} from 'zod';

export const CreateCartItemSchema = z.object({
    productId: z.number(),
    quantity: z.number(),
})

export const ChangeQuantitySchema = z.object({
    quantity: z.number()
})