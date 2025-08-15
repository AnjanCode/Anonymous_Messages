import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions : NextAuthOptions = {  
  providers: [
    CredentialsProvider({
      id : 'credentials',
      name : 'Credentials',
      credentials : {
        email : {label : 'Email', type : 'text'},
        password : {lable : 'Password', type : 'password'}
      }, 
      async authorize(credentials : any) : Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or : [
              {email : credentials.identifier},
              {username : credentials.identifier}
            ]
          });

          if (!user) {
            throw new Error ("User not found.")
          }

          if (!user.isVerified) {
            throw new Error("Please verify before login.")
          }

          const checkPassword = await bcrypt.compare(credentials.password, user.password);
          if (checkPassword) {
            return user
          } else {
            throw new Error("Invalid user password.")
          }
        } catch (error : any) {
          throw new Error(error)
        }
      }
    }),
    // ...add more providers here
  ],
  callbacks : {
    async jwt({user, token}) {
      if (user) {
        token.username = user.username
        token.isAcceptingMessages = user.isAcceptingMessages
        token.isVerified = user.isVerified
        token._id = user._id
      }
      return token
    },
    async session({session, token}) {
      if (token) {
        session.user.username = token.username
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.isVerified = token.isVerified
        session.user._id = token._id
      }
      return session
    }
  },
  pages : {
    signIn : '/sign-in'
  },
  session : {
    strategy : 'jwt'
  },
  secret : process.env.NEXTAUTH_SECRET
}