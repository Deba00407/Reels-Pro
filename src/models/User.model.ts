import mongoose, { model, Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
    email: string,
    username: string,
    password: string,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
}

const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true })

// Whenever password gets changed
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

// Cases when models already contains User
const User = models?.User || model<User>('User', userSchema)

export default User