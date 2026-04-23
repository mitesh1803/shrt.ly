import type{Request ,Response ,NextFunction} from 'express'
import z from 'zod'

const schema=z.object({
    email:z.email(),
    password:z.string().min(6)
})
const  validator=(req:Request,res:Response,next:NextFunction)=>{
    const result =schema.safeParse(req.body)
    if(!result.success){
        return res.status(401).json({mssg:"Invalid email or Password"})
    }
    next();
}





export  {validator}