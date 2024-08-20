import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";
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
  const userId= user._id
  if(!userId){
    return NextResponse.json({
        success:false,
        message:'User Id was not found'
    },{status:401})

  }
  const {acceptingMessage}= await request.json()
  try {
    
    const updatedUser= await UserModel.findByIdAndUpdate(userId,{
        isAcceptingMessage:acceptingMessage
    },{
        new:true
    })
    if(!updatedUser){
        return NextResponse.json({
            success:false,
            message:'not able to update user'
        },{status:401})

    }
    return NextResponse.json({
        success:true,
        message:'Accepting Messages Status Updated Succefully',
        updatedUser
    },{status:200})

    
  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return NextResponse.json({
        success:false,
        message:'Not Authenthicated'
    },{status:500})
    
  }
    
}

export async function GET(request:Request) {
    await dbConnect()
   const sessions= await getServerSession(authOptions)
   const user:User= sessions?.user as User
   if(!sessions || !sessions?.user){
     return NextResponse.json({
         success:false,
         message:'Not Authenthicated'
     },{status:401})
   }
   const userId= user._id
  try {
     const foundUser= await UserModel.findById(userId)
     if(!foundUser){
      return NextResponse.json({
          success:false,
          message:'User Not Found'
      },{status:401})
  
     }
     return NextResponse.json({
      success:true,
      isAcceptingMessage:foundUser.isAcceptingMessage
  },{status:201})
  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return NextResponse.json({
        success:false,
        message:'FAiled to get Status of Message'
    },{status:500})
    
  }
}