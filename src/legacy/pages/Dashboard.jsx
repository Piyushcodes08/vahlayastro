import React from 'react'
import Aside from './Aside'
import Header from '../../components/sections/Header/Header'

const Dashboard = () => {
    return (
        <>
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            <Header />
            <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10 premium-container">
                <Aside />
                <main className="flex-1 p-8">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Student <span className="text-[#dd2727]">Dashboard</span>
                        </h1>
                        <p className="text-gray-300 text-lg">Welcome back! Manage your cosmic learning journey from here.</p>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Dashboard
