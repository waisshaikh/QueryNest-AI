import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate} from 'react-router'

const ProtectedRoute = ({children}) => {
    const user = useSelector(state=> state.auth.user)
    const loading = useSelector(state=> state.auth.loading)

// Redirect to login immediately if loading is done and no user
if (!loading && !user) {
  return <Navigate to="/login" replace />
}

// Show loading while checking authentication
if (loading) {
  return <div>Loading......</div>
}

return children

}

export default ProtectedRoute
