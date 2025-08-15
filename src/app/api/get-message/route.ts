import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import mongoose from "mongoose";

export async function GET(request : Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({success : false, message : "User is not authorize."}, {status : 403})
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userMessages = await UserModel.aggregate([
            {$match : {_id : userId}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt' : -1}},
            {$group : {_id : '$_id', messages : {$push : '$messages'}}}
        ]).exec()

        if (!userMessages || userMessages.length == 0) {
            return Response.json({success : false, message : "No message found."}, {status : 403})
        }

        return Response.json({success : true, messages : userMessages[0].messages}, {status : 201})
    } catch (error) {
        console.log('Error in get message route.', error)
        return Response.json({success : false, message : "Error while getting messaages"}, {status : 500})
    }
}