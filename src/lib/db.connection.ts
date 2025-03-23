import mongoose from 'mongoose'

const mongoDB_URI = process.env.MONGODB_URI!

if (!mongoDB_URI) {
    throw new Error('Please provide MONGODB_URI in the environment variables')
}

// check if a connection is underway or existing
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { connection: null, promise: null }
}

export async function dbConnect() {
    if (cached.connection) {
        return cached.connection
    }

    if (!cached.promise) {
        const options = {
            bufferCommands: true, // disables queing up operations until a connection is established
            maxPoolSize: 10 // max connections at once
        }

        cached.promise = mongoose
            .connect(mongoDB_URI, options)
            .then(() => mongoose.connection)
    }

    // If promise is present, then wait or dump it
    try {
        cached.connection = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }
}