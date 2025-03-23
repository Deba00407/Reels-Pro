import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.connection";
import User from "@/models/User.model";

// API functions
export async function POST(req: NextRequest) {
    try {
        
        // For formData
        // const formData = await req.formData();
        // const email = formData.get("email");
        // const password = formData.get("password");
        // const username = formData.get("username");

        const {email, password, username} = await req.json()
        
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Required fields are missing" },
                { status: 404 }
            )
        }

        await dbConnect()

        // check if user is already registered
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return NextResponse.json(
                { error: "Account already exists" },
                { status: 404 }
            )
        }

        const createdUser = await User.create({
            email,
            password,
            username
        })

        if (!createdUser) {
            return NextResponse.json(
                { error: "Failed to create account" },
                { status: 500 }
            )
        }

        // check if user was created successfully
        const user = await User.find({ username }).select(["-password"])

        return NextResponse.json({
            "user": user,
            "status": {
                "statusCode": 200,
                "message": "User creation successful"
            }
        })
    } catch (error) {
        return NextResponse.json(
            { error: "Could not create account: " + error },
            { status: 500 }
        )
    }
}