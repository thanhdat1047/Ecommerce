import { z} from 'zod';

export const UpdateRole = z.object({
    role: z.string()
})
