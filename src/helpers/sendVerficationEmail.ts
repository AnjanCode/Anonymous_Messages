import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    username : string,
    email : string,
    verifyCode : string
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from : 'onboarding@resend.dev',
            to : email,
            subject : 'Verification Email',
            react : VerificationEmail({username, otp : verifyCode})
        })

        return { success : true, message : "successfully send verificaiton email."}
    } catch (error) {
        console.log("Error while sending verification email.", error)
        return { success : false, message : "Error while sending verification email."}
    }
}