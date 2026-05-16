import dotenv from "dotenv";
dotenv.config();

import ConnectToDb from "./src/config/DatabseConnetion.js";
import { testAi } from "./src/services/ai.service.js";

import app from "./src/app.js";

ConnectToDb();

if (process.env.RUN_AI_STARTUP_TEST === "true") {
    testAi().catch((error) => {
        console.error("AI startup test failed:", error.message);
    });
}




app.get("/",(req,res)=>{
    res.send(`server is running on port ${process.env.PORT || 3000}`)
})

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
