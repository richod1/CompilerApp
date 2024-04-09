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
    }catch(error:any){
        return res.status(500).send({message:"failed to fetch user detail",error:error.message})

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
    }catch(error:any){
        return res.status(500).send({message:"Having problem signing!",error:error.message})

    }

}

/**
 * longin function @login
 */

export const login=async(req:AuthRequest,res:Response)=>{
    const {userId,password}:{userId:string;password:string}=req.body;
    try{
        let existingUser=undefined;
        if(userId.includes("@")){
            existingUser=await User.findOne({email:userId})
        }else{
            existingUser=await User.findOne({username:userId})
        }

        if(!existingUser){
            return res.status(400).send({message:"User not found!"})
        }

        /**
         * compare password for valid user auth @bcrypt (compare)
         */

        const comparePass=await bcrypt.compare(password,existingUser.password)
        if(!comparePass){
            return res.status(400).send({message:"Password dont match!"})
        }

        /**assign user token @jwt */
        const JwtToken=jwt.sign({_id:existingUser._id,email:existingUser.email},
            process.env.JWT_KEY!,{expiresIn:"2d"})

        res.cookie("token",JwtToken,{
            path:"/",
            expires:new Date(Date.now() + 1000 * 60*60*48),
            httpOnly:true,
            sameSite:"lax"
        })

        return res.status(200).send({
            username:existingUser.username,
            picture:existingUser.picture,
            email:existingUser.email,
            savedCodes:existingUser.savedCodes,
        })
    }catch(error:any){
        return res.status(500).send({message:"Failed to login!",error:error.message})

    }

}

/**
 * logout function @logout
 */

export const logout=async(req:AuthRequest,res:Response)=>{
    try{
        res.clearCookie("token")
        return res.status(200).send({message:"logged out success!"})

    }catch(error:any){
        return res.status(500).send({message:"Failed to loggout",error:error.message})

    }

}