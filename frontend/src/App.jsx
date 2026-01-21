import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
// import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { axiosInstance } from './lib/axios.js'
import PageLoader from './components/PageLoader.jsx'
import { getAuthUser } from './lib/api.js'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'
import FriendsPage from './pages/FriendsPage.jsx'

const App = () => {
  
  const {isLoading, authUser} = useAuthUser()
  const {theme} = useThemeStore()
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded
   
  if (isLoading) return <PageLoader/>
  
  return (
    <div className='h-screen' data-theme={theme}>

      <Routes>
        <Route 
        path='/' 
        element={ isAuthenticated && isOnboarded ? 
        (
          <Layout ShowSidebar={true}>
            <HomePage/>
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onbording"} />
        ) } 
        />
        <Route 
          path='/signup' 
            element={ 
              !isAuthenticated ? <SignupPage/> : <Navigate to={isOnboarded ? "/" : "/onbording"} />
        }
       />
        <Route 
          path='/login' 
            element={ 
              !isAuthenticated ? <LoginPage/> : <Navigate to={isOnboarded ? "/" : "/onbording"} />
        }
       />
        <Route 
          path='/notifications' 
            element={
               isAuthenticated && isOnboarded ? (<Layout ShowSidebar={true}> <NotificationsPage/> </Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onbording"} />)
           }
        />

        <Route 
          path='/friends' 
            element={
               isAuthenticated && isOnboarded ? (<Layout ShowSidebar={true}> <FriendsPage/> </Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onbording"} />)
           }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? ( <CallPage /> ) : ( <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} /> )
          }
        />
        <Route 
          path='/chat/:id' 
            element={
               isAuthenticated && isOnboarded ? (<Layout ShowSidebar={false}> <ChatPage/> </Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onbording"} />)
           }
        />
        <Route 
          path='/onbording' 
            element={ isAuthenticated ? (
        !isOnboarded ? (
          <OnboardingPage/>
        ) : (
          <Navigate to="/" />
        )
      ) : (
        <Navigate to="/login" />
      )}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App