import mongoose, { Schema } from "mongoose";

export interface Message extends Document {
    _id: string;
    content : string,
    createdAt : Date
}

const messageSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    }
})

export interface User extends Document {
    username : string,
    email : string,
    password : string,
    verifyCode : string,
    verifyCodeExpiry : Date,
    isVerified : boolean,
    isAcceptingMessages : boolean,
    messages : Message[]
}

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password : {
        type : String,
        required : true
    },
    verifyCode : {
        type : String,
        required : true
    },
    verifyCodeExpiry : {
        type : Date,
        required : true
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    messages : [messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);
export default UserModel;