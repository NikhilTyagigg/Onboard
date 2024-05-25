/**
 * Onboard Project
 * Created By: KSPL
 */
import React, { Suspense } from "react"
import Router from "./router/Router"
import { 
  ACCESS_TYPE, 
  LOCAL_STORE_KEY,
  DEVELOPMENT_TYPE
 } from "./utility/constants/localStoreKeys"
import "./App.css"
const App = () => {
  // This is to enable or disable admin mode
  localStorage.setItem(LOCAL_STORE_KEY.USER_MODE, ACCESS_TYPE.USER)
  // Development mode
  localStorage.setItem(LOCAL_STORE_KEY.DEVELOPMENT_MODE, DEVELOPMENT_TYPE.PROD)

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
