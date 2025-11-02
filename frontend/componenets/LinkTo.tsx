import React from 'react'
import getServerSession  from "next-auth"
import Link from 'next/link'
import { authOptions } from '@/app/auth'

const LinkTo = async() => {
  const session = await getServerSession(authOptions)

  return (
    <>
    {!session ? <Link href={'./pages/signup'}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl px-10 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-20"
    >
      Get Started
    </Link>: 
     <Link href={'./pages/dashboard' }
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl px-10 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 mb-20"
      >
      Get Started</Link>
    }
     
    </>
    
  )
}

export default LinkTo