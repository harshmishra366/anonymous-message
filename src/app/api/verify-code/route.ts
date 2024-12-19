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
  // Add debugging logs
console.log('Current time:', new Date().getTime());
console.log('Token expiry:', new Date(user.verifyTokenExpiry).getTime());
console.log('Token:', user.verifyToken);
console.log('Code:', code);

// Fix the verification check
const isCodeValid = user.verifyToken === code;
const isCodeNotExpired = new Date(user.verifyTokenExpiry).getTime() > new Date().getTime();

// Add more detailed logs for debugging
console.log('Is code valid:', isCodeValid);
console.log('Is not expired:', isCodeNotExpired);

if (isCodeValid && isCodeNotExpired) {
  user.isVerified = true;
  await user.save();
  return NextResponse.json({
    success: true,
    message: 'Account Verified Successfully'
  }, { status: 201 });
} else if (!isCodeNotExpired) {
  return NextResponse.json({
    success: false,
    message: 'Token is expired',
    debug: {
      expiryTime: new Date(user.verifyTokenExpiry),
      currentTime: new Date(),
    }
  }, { status: 401 });
} else {
  return NextResponse.json({
    success: false,
    message: 'Incorrect verification code'
  }, { status: 400 });
}
    
  } catch (error) {
    return NextResponse.json({
        success:false,
        message:'Verification code error'
    },{status:401})
    
  }

}