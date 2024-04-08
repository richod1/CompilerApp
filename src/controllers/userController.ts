import {Request,Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/UserModel"
import { AuthRequest } from "../middlware/verifyToken"

// user detailes function
export const userDetails=async(req:AuthRequest,res:Response)=>{
    const userId=req._id;
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).send({message:"User not found!"})
        }

        return res.status(200).send({
            username:user.username,
            picture:user.picture,
            email:user.email,
            savedCodes:user.savedCodes
        })
    }catch(error){
        return res.status(500).send({message:"failed to fetch user detail"})

    }

}


/**
 * signup function @signup
 */

export const signUp=async()=>{

}

/**
 * longin function @login
 */

export const login=async()=>{

}

/**
 * logout function @logout
 */

export const logout=async()=>{

}