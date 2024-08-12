import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { message } from "@/schema/message";
import bcryptjs from "bcryptjs"
import { use } from "react";
import VerificationEmail from "../../../../emails/VerificationEmails"
import { sendVerifyEmails } from "@/helpers/verificationEmail";


export  async function POST(request:Request){

    await dbConnect()
    try {
        const {username,email,password}= await request.json()
        if(!email && !username &&!password){
            return Response.json({
                message:"All the fields are require"
            })
        }

        const existingUsernameAndVerified= await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUsernameAndVerified){
            return Response.json({
                message:"Username already exist ",
                success:false

            },{
                status:401
            })
        }
        const existingEmail= await UserModel.findOne({email})
        let verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingEmail){
            if(existingEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"Email is already registered"
                },{
                    status:501
                })

            }
            else{
                const hashedPassword= await bcryptjs.hash(password,10)
                existingEmail.password=hashedPassword,
                existingEmail.verifyToken=verifyToken,
                existingEmail.verifyTokenExpiry = new Date(Date.now() + 3600000);
            }

        }
        else{
            const hashedPassword= await bcryptjs.hash(password,10)
            const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser=  new UserModel({
        username,
        email,
        password:hashedPassword,
        verifyTokenExpiry:expiryDate,
        verifyToken,
        isAcceptingMessage:true,
        message:[]

        
      })
      await newUser.save()
      if(!newUser){
        Response.json({success:false,
            message:"there was some problem  occured while regestering"
        },{status:501})
      }

        }
          // send verification email
      const sendEmail= await sendVerifyEmails(email,username,verifyToken)
      if (!sendEmail.success) {
        return Response.json(
          {
            success: false,
            message: sendEmail.message,
          },
          { status: 500 }
        );
      }
    //  const user=   await UserModel.findByIdAndUpdate({
    //         username,
    //         email,
    //         password
    //     })
    //     if(!user){
    //         return Response.json({
    //             message:"Error while saving fields in database"
    //         })
    //     }
    return Response.json({
        sucess:true,
        message:"User registered succesfully "
    },{
        status:201
    })
        
       
    } catch (error:any) {
        console.log("Error regestering user",error.message);
        return Response.json({
            success:false,
            message:"Error regestering user"
        },
    {
        status:500
    })
        
        
    }
  

}

