import React from 'react'
import { useSelector } from 'react-redux'

const protected = ({children}) => {
    const user = useSelector(state=> state.auth.user)
    const loading = useSelector(state=> state.auth.loading)


   

  return (
    <div>protected</div>
  )
}

export default protected