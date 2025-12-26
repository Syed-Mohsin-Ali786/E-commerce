import Navbar from '../components/seller/Navbar'
import Sidebar from '../components/seller/Sidebar'
import React from 'react'
import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout