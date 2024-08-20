import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import {usernameSchema} from '@/schema/signUpSchema'
import { message } from "@/schema/message";
import { NextResponse,NextRequest } from "next/server";

export async function POST(request:Request){

  await  dbConnect()
  try {
    const {username,code}= await request.json()
  const decodedusername=  decodeURIComponent(username)
  if(!decodedusername){
    return NextResponse.json({
        success:false,
        message:' Usename is required'
    },{status:401})

  }
  const user= await UserModel.findOne({username:decodedusername})
  if(!user){
    return NextResponse.json({
        success:false,
        message:' Usename not found'
    },{status:401})


  }
  const isCodeValid=  user.verifyToken=== code
  const isCodenotExpired= new Date(user.verifyToken)> new Date()

  if(isCodeValid&&isCodenotExpired){
    user.isVerified= true
    await user.save()
    return NextResponse.json({
        success:true,
        message:'Account Verified Suuccesfully'
    },{status:201})


  }else if(!isCodenotExpired){
    return NextResponse.json({
        success:false,
        message:'Token is expired'
    },{status:401})

  }
  else{
    return NextResponse.json({
        success:false,
        message:'Icoorect verification code '
    },{status:400})
  }
    
  } catch (error) {
    return NextResponse.json({
        success:false,
        message:'Verification code error'
    },{status:401})
    
  }

}