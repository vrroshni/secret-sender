import mongoose from 'mongoose';
type ConnectionObject = {
    isConnnected?: number
}

const connection: ConnectionObject = {}
async function dbConnect(): Promise<void> {
    if (connection.isConnnected) {
        console.log("already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '', {});
        connection.isConnnected = db.connections[0].readyState;
        console.log("Db connected");
    } catch (error) {
        console.log("Db failed",error);
        process.exit(1)
    }
}

export default dbConnect;