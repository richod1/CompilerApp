import express from "express"
import {Request,Response} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { dbConnect } from "./lib/dbConnect"
import {config} from "dotenv"

const port:number=3000
const app=express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
config();

/**
 * developing an online compiler @backend with node
 * 
 * first step is getting types of language parser 
 */


// test endpoint
app.get('/api',(req:Request,res:Response)=>{
    res.status(200).json({name:"degraft"})
})

app.listen(port,()=>{
    /**
     * making our server to wait for database connection befor app server start
     * 
     */
    dbConnect();
    console.log(`server is running on port :${port}`)
}).on('error',(error:any)=>{
    console.log(`server failed ${error}`)
    throw new Error(`server failed on port ${port}`)
})
