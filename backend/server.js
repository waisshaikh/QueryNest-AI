import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import ConnectToDb from "./src/config/DatabseConnetion.js";
import app from "./src/app.js"

ConnectToDb();

app.get("/",(req,res)=>{
    res.send("server is running on port 3000")
})

app.listen(3000,(req,res)=>{
    console.log("Server is running on port 3000");
    
})