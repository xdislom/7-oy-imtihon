"use client";

import React, { useState } from 'react';
import StudentSidebar from "@/components/StudentSidebar";
import StudentHeader from "@/components/StudentHeader";

export default function StudentHome() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderCalendar = () => {
        const daysOfWeek = ['D', 'S', 'C', 'P', 'J', 'S', 'Y'];
        const dates = [
            [1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19, 20, 21],
            [22, 23, 24, 25, 26, 27, 28],
            [29, 30, null, null, null, null, null]
        ];
        
        const hasClass = [11, 13, 16, 18, 20, 23, 25, 27, 30];

        return (
            <div className="bg-white rounded-[12px] p-6 shadow-sm w-[320px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 cursor-pointer text-gray-700 font-[500] text-[15px]">
                        Iyun 2026 <i className="fa-solid fa-chevron-down text-[10px] text-gray-500 mt-0.5"></i>
                    </div>
                    <div className="flex items-center gap-5 text-gray-500">
                        <i className="fa-solid fa-chevron-left text-[12px] cursor-pointer hover:text-gray-800"></i>
                        <i className="fa-solid fa-chevron-right text-[12px] cursor-pointer hover:text-gray-800"></i>
                    </div>
                </div>
                
                <div className="grid grid-cols-7 mb-4 text-center">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-gray-400 text-[12px] font-[500]">{day}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-y-4 text-center">
                    {dates.flat().map((date, index) => {
                        if (!date) return <div key={`empty-${index}`}></div>;
                        
                        const isCurrent = date === 10;
                        const hasRedDot = hasClass.includes(date);
                        
                        return (
                            <div key={date} className="relative flex justify-center items-center h-8">
                                <div className={`flex justify-center items-center w-8 h-8 rounded-full text-[13px] text-gray-700 font-[500] cursor-pointer ${isCurrent ? 'border border-gray-400' : 'hover:bg-gray-50'}`}>
                                    {date}
                                </div>
                                {hasRedDot && (
                                    <div className="absolute -bottom-0.5 w-1.5 h-1.5 bg-[#f43f5e] rounded-full"></div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
            <div className="flex">
                <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 w-full overflow-hidden">
                    <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} onSidebarClose={() => setIsSidebarOpen(false)} />
                    
                    <div className="p-[20px] md:p-[30px] flex flex-col gap-6">
                        <div>
                            <h2 className="text-[22px] font-bold text-gray-800 flex items-center gap-2 mb-4">
                                Kumushlar: 1427 <i className="fa-regular fa-gem text-gray-400 text-[18px]"></i>
                            </h2>
                            
                            <div className="bg-white rounded-[12px] p-6 shadow-sm w-[320px]">
                                <div className="flex items-center gap-2 mb-7">
                                    <i className="fa-solid fa-arrow-trend-up text-blue-500 text-[18px]"></i>
                                    <span className="font-bold text-gray-800 text-[15px]">Bosqich: 2</span>
                                </div>
                                
                                <div className="mb-6 relative">
                                    <div className="bg-[#4ade80] text-white text-[11px] font-bold px-2 py-0.5 rounded-full absolute -top-6 left-0">
                                        508 / 750
                                    </div>
                                    <div className="w-full bg-[#bbf7d0] h-[8px] rounded-full mt-2 overflow-hidden">
                                        <div className="bg-[#4ade80] h-full rounded-full w-[67%]"></div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-5">
                                    <i className="fa-solid fa-globe text-[#4ade80] text-[20px]"></i>
                                    <span className="font-bold text-gray-800 text-[15px]">XP: 508</span>
                                </div>
                                
                                <div className="mb-2">
                                    <span className="font-bold text-gray-800 text-[15px]">Reyting</span>
                                </div>
                                
                                <div>
                                    <span className="font-bold text-gray-800 text-[15px]">Umumiy: </span>
                                    <span className="font-medium text-[#ea580c] text-[15px]">3376 - o'rin</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-2">
                            <h3 className="text-[15px] font-bold text-gray-700 mb-3">Dars jadvali</h3>
                            {renderCalendar()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
