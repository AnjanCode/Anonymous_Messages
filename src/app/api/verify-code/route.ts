import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request : Request) {
    await dbConnect();

    try { 
        const { username, code } = await request.json();
        console.log(username)
        const decodeUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username : decodeUsername})

        if (!user) {
            return Response.json({
                success : false,
                message : "User is not found."
            }, { status : 404 })
        }

        const checkTheVerifyCode = user.verifyCode === code;
        const isCodeExpried = new Date(user.verifyCodeExpiry) > new Date();

        if (checkTheVerifyCode && isCodeExpried) {
            user.isVerified = true;
            await user.save();
            return Response.json({success : true, message : "User is verified."}, { status : 201 })
        } else if (!isCodeExpried) {
            return Response.json({success : false, message : "Code is expired. please signup again to get new code."}, { status : 403 })
        } else {
            return Response.json({success : false, message : "Invalid verification code."}, { status : 403 })
        }

    } catch (error) {
        console.log('Error in verify code route.', error)
        return Response.json({success : false, message : "Error while verifing user."}, { status : 500 })
    }
}