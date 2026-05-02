import React from 'react'
import Aside from './Aside'
import Header from '../../components/sections/Header/Header'

const Dashboard = () => {
    return (
        <>
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            <Header />
            <div className="flex flex-col md:flex-row min-h-screen pt-[70px] bg-gray-50">
                <Aside />
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Student Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Manage your cosmic learning journey from here.</p>
                </main>
            </div>
        </>
    )
}

export default Dashboard
