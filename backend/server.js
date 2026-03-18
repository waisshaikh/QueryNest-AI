import dotenv from "dotenv";
dotenv.config();
import ConnectToDb from "./src/config/DatabseConnetion.js";
import app from "./src/app.js"

ConnectToDb();

app.listen(3000,(req,res)=>{
    console.log("Server is running on port 3000");
    
})