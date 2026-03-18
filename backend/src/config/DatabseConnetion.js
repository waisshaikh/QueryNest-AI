import mongoose from "mongoose";

async function ConnectToDb() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected To Databse");
        
    });
    
}

export default ConnectToDb;
