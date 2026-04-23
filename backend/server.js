import dotenv from "dotenv";
dotenv.config()

import ConnectToDb from "./src/config/DatabseConnetion.js";
import {testAi } from "./src/services/ai.service.js";

import app from "./src/app.js"

ConnectToDb();
testAi();




app.get("/",(req,res)=>{
    res.send("server is running on port 3000")
})

app.listen(3000,(req,res)=>{
    console.log("Server is running on port 3000");
    
})