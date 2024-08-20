import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import {usernameSchema} from '@/schema/signUpSchema'
import { message } from "@/schema/message";
import { NextResponse,NextRequest } from "next/server";
export const usernameQuerySchema=z.object({
    username:usernameSchema
})

export async function GET(request:Request){
    await dbConnect()
    try {
       
        const {searchParams}= new URL(request.url)
        const queryParams={
               username:searchParams.get('username')
        }
        const result= usernameQuerySchema.safeParse(queryParams)

        if(!result.success){
            const usernameErrors= result.error.format().username?._errors || []

            console.log("Invalid username")
            return NextResponse.json({
                success:false,
                message:`Invalid username ${usernameErrors} `
            },{status:400})
        }
        // const existingUser= await UserModel.findOne({
           
        //     isVerified:true
        // })
        const {username}= result.data
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
          });
          if(existingVerifiedUser){
            return NextResponse.json({
                success:false,
                message:'Username already taken'
            },{status:400})
          }
         
          return NextResponse.json({
            success:true,
            message:'Username Unique'
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:'Username identification error'
        },{status:401})
        
    }

}