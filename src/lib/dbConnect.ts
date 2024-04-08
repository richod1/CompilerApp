import mongoose from "mongoose"

export const dbConnect=async()=>{
    try{

       mongoose.connect(`${process.env.MONGO_URL as string}`,{
        dbName:"online-compiler"
       })
       console.log("Dtabase connection established")

    }catch(error){
        console.log("error connecting database")
    }
}