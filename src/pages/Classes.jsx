import React, { useState } from 'react'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function Classes() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    return (
        <div className="max-w-[1600px] m-auto bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />
                    <div className="mt-[20px]">
                        <h2 className="text-[28px] font-[600]">Sinflar</h2>
                        <p className="text-gray-600 font-[500]">Sinflar ro'yxati bu yerda ko'rsatiladi.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
