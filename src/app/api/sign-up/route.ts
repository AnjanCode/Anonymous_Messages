import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";


export async function POST(request : Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const checkIsUsernameUnique = await UserModel.findOne({username, isVerified : true})
        if (checkIsUsernameUnique) {
            return Response.json({
                success : false,
                message : "Username is already taken. please use another username."
            }, { status : 402 })
        }
        const checkIsEmailExists = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (checkIsEmailExists) {
            if (checkIsEmailExists.isVerified) {
                return Response.json({success : false, message : "User is already exists."}, { status : 403 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                checkIsEmailExists.password = hashedPassword;
                checkIsEmailExists.verifyCode = verifyCode;
                checkIsEmailExists.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await checkIsEmailExists.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessages : true,
                messages : []
            });
            await newUser.save();
        }


        //send Verification email
        const response = await sendVerificationEmail(username, email, verifyCode);
        if (!response.success) {
            return Response.json({success : false, message : "Error while sending verification code."}, {status : 403})
        }

        return Response.json({success : true, message : "user created successfully."}, { status : 201 })
    } catch (error) {
        console.log("Error in sign up route.", error)
        return Response.json({
            success : false,
            message : "Error while signing up."
        }, { status : 403 })
    }
}