import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";


export async function POST(request : Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({success : false, message : "User is not authorize."}, {status : 403})
    }
    const { acceptMessages } = await request.json();
    const userId = user._id;

    try {
        const findUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessages : acceptMessages}, { new : true });
        if (!findUser) {
            return Response.json({success : false, message : "user accept message updatation failed."}, {status : 404})
        }

        return Response.json({success : true, message : "User accept message updated successfully."}, {status : 201})
    } catch (error) {
        console.log('Error in accept message post route.', error)
        return Response.json({success : false, message : "Error while updating accept message"}, {status : 403})
    }
}

export async function GET(request : Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({success : false, message : "User is not authorize."}, {status : 403})
    }
    const userId = user._id;

    try {
        const findUser = await UserModel.findById(userId)
        if (!findUser) {
            return Response.json({success : false, message : "User not found."}, {status : 404})
        }
        // console.log("message position : ", findUser.isAcceptingMessages);

        return Response.json({
            success : true,
            isAcceptingMessages : findUser.isAcceptingMessages
        }, {status : 201})
    } catch (error) {
        console.log("Error in accept message get route.", error)
        return Response.json({success : false, message : "Error while getting accept message status."}, {status : 500})
    }
}