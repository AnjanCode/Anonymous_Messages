import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user";

export async function POST(request:Request) {
    await dbConnect();
    const { content, username } = await request.json();
    const decodeUser = decodeURIComponent(username)
    try {
        const user = await UserModel.findOne({username : decodeUser})
        if (!user) {
            return Response.json({success : false, message : "User not found"}, {status : 404})
        }

        if (!user.isAcceptingMessages) {
            return Response.json({success : false, message : "User is not accepting message."}, {status : 403})
        }
        const newMessage = { content, createdAt : new Date()}
        user.messages.push(newMessage as Message);
        await user.save()

        return Response.json({success : true, message : "Message send successfully."}, {status : 201})
    } catch (error) {
        console.log("Error in send message route.", error);
    }
}