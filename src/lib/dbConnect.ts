import mongoose from 'mongoose'


if(!process.env.MONGODB_URL){
    throw new Error("Please define MONGODB_URL environment variable in .env");
}

const MONGODB_URL : string = process.env.MONGODB_URL

// 1:: Type Definition form mongoose in Global Scope:
let globalWithMongoose =  global as typeof globalThis & { mongoose: any; };

// 2:: Caching mongoose instance
let cached = globalWithMongoose.mongoose;
if(!cached) {
    cached = globalWithMongoose.mongoose = {conn:null , promise: null}
}
// 3:: Database Connection Function
async function dbConnect(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise) {
        const opts = {
            dbName: "scalperapp",
            bufferCommands: false
        };

        cached.promise = mongoose.connect(MONGODB_URL,opts).then(mongoose => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;