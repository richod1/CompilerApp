import express from "express"
export const userRouter=express.Router();
import { signUp,login,logout,userDetails } from "../controllers/userController";
import { verifyToken } from "../middlware/verifyToken";
import { getAllCodes,getMyCodes } from "../controllers/compilerController";


userRouter.post("/signup",signUp)
userRouter.post("/login",login)
userRouter.post("/logout",logout)

userRouter.get("/user-details",verifyToken,userDetails)
userRouter.get("/get-mycode",verifyToken,getMyCodes)