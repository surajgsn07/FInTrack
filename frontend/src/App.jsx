import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';

const App = () => {
  
  return (
    <div className=' ' >
      <ToastContainer />
      <Header/>
      <Outlet/>
      {/* <Sidebar/> */}
       </div>
  )
}

export default App