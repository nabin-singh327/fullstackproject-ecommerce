import React from 'react'
import { NavLink, Outlet } from 'react-router'

const Dashboard = () => {
  // Base styling for sidebar links
  const linkStyles = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive 
        ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 px-4 py-6 flex flex-col gap-6 shrink-0">
        <div className="px-4">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-0.5">Management Suite</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          <NavLink to="/admin/order-management" className={linkStyles}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Order Management
          </NavLink>

          <NavLink to="/admin/user-management" className={linkStyles}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            User Management
          </NavLink>

          <NavLink to="/admin/food-management" className={linkStyles}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Food Management
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default Dashboard
