import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/user";

export async function DELETE(request : Request, {params} : {params : {messageid : string}})  {
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({success : false, message : "User is not authorize."}, {status : 403})
    }
    const userId = user._id;

    try {
        const deleteMessage = await UserModel.updateOne(
            {_id : userId}, 
            {$pull : { messages : {_id : messageId}}}
        )
        if (deleteMessage.modifiedCount == 0) {
            return Response.json({success : false, message : "Message not found."}, {status : 404})
        }

        return Response.json({success : true, message : "Message deleted successfully."}, {status : 201})
    } catch (error) {
        console.log('Error in delete message route.', error);
        return Response.json({
            success : false,
            message : "Error while deleting message."
        }, {status : 500})
    }
}