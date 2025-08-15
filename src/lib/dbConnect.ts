import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const Connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if (Connection.isConnected) {
        console.log('Database connection already exists.')
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        Connection.isConnected = db.connections[0].readyState;
        console.log('Database connected successfully.');
    } catch (error) {
        console.error("Error while connecting to database.")
        process.exit(1)
    }
}

export default dbConnect;