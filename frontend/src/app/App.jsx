import { RouterProvider } from "react-router";
import { router, Router } from "./App.router";
import { useAuth } from "../features/hook/useAuth";
import { useEffect } from "react";

function App(){
  const Auth = useAuth()

  useEffect(()=>{
    Auth.handleGetMe()
  }, [])

  return(
    < RouterProvider router={router}/>
  )
}

export default App