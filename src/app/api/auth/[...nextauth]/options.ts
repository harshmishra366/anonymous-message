import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import { use } from "react";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                           { email: credentials.identifier},
                           { username: credentials.identifier}
                            
                        ]
                    })
                    if(!user){
                        throw new Error("User was not found please check your email and password")
                    }
                    if(!user.isVerified){
                        throw new Error("Please Verify your email before Login")

                    }
                    const isPasswordRight=await bcrypt.compare(credentials.password,user.password)
                    if(!isPasswordRight){
                        throw new Error("Your Password is incorrect")
                    }
                    else{
                        return user
                    }
                } catch (err:any) {
                    throw new Error(err.message)
                    
                }

              }
        })

    ],
    callbacks:{
        async jwt({ token, user }) {
             token._id= user._id,
             token.isVerified= user.isVerified,
             token.isAcceptingMessage=user.isAcceptingMessage,
             token.useranme=user.username

            
            return token
          },
        async session({ session, user, token }) {
            if(token){
                session.user._id=token._id,
                session.user.isVerified=token.isVerified,
                session.user.isAcceptingMessage=token.isAcceptingMessage,
                session.user.username=token.username
            }
            return session
          },
          
    }
    ,
    pages:{
        signIn: '/signin',
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
       
    

}