import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:Request) {
    const {username,content}= await request.json()
    if(!username || !content){
        return NextResponse.json({
            success:false,
            message:'Both fields are required'
        },{status:401})
    }
    try {
        const user= await UserModel.findOne(username)
        if(!user){
            return NextResponse.json({
                success:false,
                message:'User  not found'
            },{status:404})

        }
        if(!user.isAcceptingMessage){
            return NextResponse.json({
                success:false,
                message:'User  not found'
            },{status:403})

        }
        const newMessage={
            content,
            createdAt: new Date()
        }
        user.message.push(newMessage as Message)
        await user.save()
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
          );

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false,
            message:'An unexpected error occured while sending message'
        },{status:500})
        
    }
    
}