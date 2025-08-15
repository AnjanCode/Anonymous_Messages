import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username : searchParams.get('username')
        }
        const response = UsernameQuerySchema.safeParse(queryParam);
        
        if (!response.success) {
            const usernameErrors = response.error.format().username?._errors || []
            return Response.json({success : false, message : usernameErrors.length > 0 ? usernameErrors.join(',') : "Invalid url"}, {status : 403})
        }
        const { username } = response.data;
        const user = await UserModel.findOne({username, isVerified : true})
        if (user) {
            return Response.json({success : false, message : "Username is already taken."}, {status : 403})
        }

        return Response.json({success : true, message : "Username is unique"}, {status : 201})
    } catch (error) {
        console.log('Error in check username unique route.', error)
        return Response.json({success : false, message : "Error while check username unique."}, {status : 403})
    }
}