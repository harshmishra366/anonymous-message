import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number

}
const connection:ConnectionObject={}

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Database is connected");
        return
        
    }
    try {
        const db= await mongoose.connect(process.env.MONGODBURL ||'')
        connection.isConnected= db.connections[0].readyState
        console.log(db);
        
        
        console.log("DataBase is connected")
    } catch (error) {
        console.log("database connection failed ",error);
        process.exit(1)
        
        
    }
    
}