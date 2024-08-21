import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose, { Mongoose } from "mongoose";
export async function POST(request:Request) {
   await dbConnect()
  const sessions= await getServerSession(authOptions)
  const user:User= sessions?.user as User
  if(!sessions || !sessions?.user){
    return NextResponse.json({
        success:false,
        message:'Not Authenthicated'
    },{status:401})
  }
  const userId= new mongoose.Types.ObjectId(user._id)
  try {
    const user= await UserModel.aggregate([
        {$match:{id:userId}},
        {$unwind:'$message'},
        {$sort:{'$message.createdAt':-1}},
        {$group:{_id:'$_id',message:{$push:'$message'}}}
    ])
    if(!user || user.length===0){
        return NextResponse.json({
            success:false,
            message:'User not found'
        },{status:401})

    }
    return NextResponse.json({
       
        message:user[0].message
    },{status:201})

    
  } catch (error) {
    return NextResponse.json({
        success:false,
        message:'Failed to get messages please try again'
    },{status:401})

    

    
  }
}