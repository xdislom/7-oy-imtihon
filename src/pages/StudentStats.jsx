import React, { useState } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';

export default function StudentStats() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
            <div className="flex">
                <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 w-full overflow-hidden">
                    <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} onSidebarClose={() => setIsSidebarOpen(false)} />
                    
                    <div className="p-[20px] md:p-[30px]">
                        <div className="bg-white rounded-[12px] p-10 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
                            <i className="fa-solid fa-chart-simple text-[60px] text-gray-300 mb-4"></i>
                            <h2 className="text-2xl font-bold text-gray-800">Bu Ko'rsatgichlarim bo'limi</h2>
                            <p className="text-gray-500 mt-2">Hozircha bu yerda ma'lumot yo'q</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
