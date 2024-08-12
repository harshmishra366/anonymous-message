
import { resend } from "@/lib/resend";
import VerificationEmail from  "../../emails/VerificationEmails"
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerifyEmails(email:string,username:string,verifyToken:string):Promise<ApiResponse>{


    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyToken }),
          });


        return {success:true, message:"Verification email sent successfully"}

        
    } catch (error) {

        return {success:false, message:"Error in sending Verification Email"}
        
    }
}
