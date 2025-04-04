import UserContextProvider from '@/services/context/UserContext'
import UserContext from '@/services/context/UserContext'
import React from 'react'

function Providers({children}) {
  return (
    <UserContextProvider>
      {children}
    </UserContextProvider>
  )
}

export default Providers
