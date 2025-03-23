import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIM = {
    width: 1080,
    height: 1920
} as const // gets treated as a const 

export interface Video {
    _id?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoURL: string,
    thumbnailURL: string,
    controls?: boolean,
    transformation?: {
        height: number,
        width: number,
        quality?: number
    },
    createdAt?: Date,
    updatedAt?: Date
}

const videoSchema = new Schema<Video>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoURL: {
        type: String,
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    controls: {
        type: Boolean,
        default: true
    },
    transformation: {
        height: {
            type: Number,
            default: VIDEO_DIM.height
        },
        width: {
            type: Number,
            default: VIDEO_DIM.width
        },
        quality: {
            type: Number,
            min: 1,
            max: 100
        }
    }
}, { timestamps: true })

const Video =models?.Video || model<Video>('Video', videoSchema)

export default Video