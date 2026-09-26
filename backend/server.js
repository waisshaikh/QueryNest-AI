import dotenv from "dotenv";
dotenv.config();
import http from "http"
import ConnectToDb from "./src/config/DatabseConnetion.js";
// import { testAi } from "./src/services/ai.service.js";
import app from "./src/app.js";
import { initSocket } from "./src/sockets/server.socket.js";




const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app)
initSocket(httpServer)


ConnectToDb()
    .catch((err)=>{
        console.error("mongo connection failed",err)
        process.exit(1)
    })



// if (process.env.RUN_AI_STARTUP_TEST === "true") {
//     testAi().catch((error) => {
//         console.error("AI startup test failed:", error.message);
//     });
// }



app.get("/",(req,res)=>{
    res.send(`server is running on port ${process.env.PORT || 3000}`)
})


// testAi()




httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
