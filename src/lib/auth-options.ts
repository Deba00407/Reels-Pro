import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { dbConnect } from "./db.connection";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                username: {label: "Username", type: "text"}
            },
            async authorize(credentials){
                if (!credentials?.email || !credentials?.password || !credentials?.username){
                    throw new Error("All fields are required")
                }

                try {
                    await dbConnect()
                    const existingUser = await User.findOne({username: credentials.username})

                    if(!existingUser){
                        throw new Error("Account not found. Please Sign In")
                    }

                    const validate = await bcrypt.compare(credentials.password, existingUser.password)

                    if(!validate){
                        throw new Error("Passwords do not match")
                    }

                    return {
                        id: existingUser._id.toString(),
                        username: existingUser.username,
                        email: existingUser.email
                    }

                } catch (error) {
                    throw new Error("Authentication Failed")
                }
            }
        }),

        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        })
    ],

    callbacks: {
        async session({session, token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        },  
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        }
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },

    pages: {
        signIn: '/login',
        error: '/error'
    },

    secret: process.env.NEXTAUTH_SECRET
}