import {Request,Response,NextFunction} from "express"
import jwt,{JsonWebTokenError} from "jsonwebtoken"

export interface AuthRequest extends Request{
    _id?:string;
}

export const verifyToken=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    

}