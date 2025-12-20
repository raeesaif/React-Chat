import React, { useEffect } from 'react'
import JoinGroup from './pages/JoinGroup.jsx'
import ChatPage from './pages/ChatPage'
import OpenChat from './pages/OpenChat.jsx'
import Home from './pages/Home.jsx'
import Signup from './component/Signup.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OpenChatMessage from './pages/OpenChatMessage.jsx'
import Login from './component/Login.jsx'
const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/room-chat' element={<JoinGroup />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/open-chat' element={<OpenChat />} />
          <Route path='/open-chatmessage' element={<OpenChatMessage />} />

        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App