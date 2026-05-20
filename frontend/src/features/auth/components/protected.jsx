import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate} from 'react-router'

const protected = ({children}) => {
    const user = useSelector(state=> state.auth.user)
    const loading = useSelector(state=> state.auth.loading)

if (loading) {
  return <div>Loading......</div>
}

if (!user){
  return <Navigate to = "/login" replce/>
}

return children
   

  return (
    <div>protected</div>
  )
}

export default protected