import express,{Express,Response,Request} from 'express';
import {PORT} from './sercets';
import rootRouter from './routes';
import { Prisma, PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import { SignUpSchema } from './schema/users';
import bodyParser from 'body-parser';
const app:Express = express();

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/api/v1/',rootRouter)

export const prismaClient = new  PrismaClient({
    log:['query']
})

app.use(errorMiddleware)
app.listen(PORT, ()=> {console.log('App working on port',PORT);
})