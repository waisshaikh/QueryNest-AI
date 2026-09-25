import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate, RouterProvider} from 'react-router'

const ProtectedRoute = ({children}) => {
    const user = useSelector(state=> state.auth.user)
    const loading = useSelector(state=> state.auth.loading)

if(loading){
  return <div>Loading.......</div>
}

if(!user){
  return <Navigate to = "/login" replace/>
}

return children

}

export default ProtectedRoute
