'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react"

const NavBar = () => {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            href='/' 
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
              Resumater
            </span>
          </Link>

          {!session ? <ul className="flex items-center space-x-2">
            <li>
              <Link 
                href='./pages/upload'
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50"
              >
                Upload
              </Link>
            </li>
            <li>
              <Link 
                href='./pages/signup'
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50"
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                href='./pages/signup'
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </li>
          </ul> : 
          
          <ul className="flex items-center space-x-2">
            <li>
              <Link 
                href='./pages/upload'
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50 font-bold"
              >
                Welcome {session.user?.name}!
              </Link>
            
            </li>
          </ul>

          }
          
        </div>
      </div>
    </nav>
  )
}

export default NavBar