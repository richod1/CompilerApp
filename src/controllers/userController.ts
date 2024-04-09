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

export const signUp=async(req:AuthRequest,res:Response)=>{
    const {email,password,username}=req.body;
    const usernameRegex=/^[a-zA-z0-9]+$/;
    try{
        const existingUser=await User.findOne({email:email})
        if(existingUser){
            return res.status(400).send({message:"User already exist"})
        }
        if(!usernameRegex.test(username)){
            return res.status(400).send({message:"Username is not aligned!"})
        }

        /**
         * salting user and hash passowd @jwt
         */
        const genSaltRound:number=10;
        const salt=await bcrypt.genSalt(genSaltRound);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=await User.create({
            email:email,
            password:hashedPassword,
            username:username,
        })

        const jwtToken=jwt.sign({_id:user._id,email:user.email},process.env.JWT_KEY!,{expiresIn:"2d"});
        res.cookie("token",jwtToken,{
            path:"/",
            expires:new Date(Date.now() * 1000 *60*60*48),
            httpOnly:true,
            sameSite:"lax"
        })

        return res.status(201).send({
            username:user.username,
            picture:user.picture,
            email:user.email,
            savedCodes:user.savedCodes,
        })
    }catch(error){
        return res.status(500).send({message:"Having problem signing!"})

    }

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