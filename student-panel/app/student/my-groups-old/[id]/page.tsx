"use client";

import React, { useState } from 'react';
import StudentSidebar from "@/components/StudentSidebar";
import StudentHeader from "@/components/StudentHeader";
import { useRouter, useParams } from "next/navigation";
;

export default function StudentGroupDetail() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const params = useParams(); const id = params?.id as string;
    const router = useRouter();

    const lessons = [
        { id: 1, title: 'NextJs', video: '0', hwStatus: 'Qaytarilgan', hwDeadline: '2026 M06 11 20:00', date: '2026 M06 11' },
        { id: 2, title: 'crm loyihasi', video: '2', hwStatus: 'Qabul qilingan', hwDeadline: '2026 M06 09 20:00', date: '2026 M06 09' },
        { id: 3, title: 'Imtihon', video: '0', hwStatus: 'Qabul qilingan', hwDeadline: '2026 M06 02 20:00', date: '2026 M06 02' },
        { id: 4, title: 'State and Props', video: '1', hwStatus: 'Berilmagan', hwDeadline: '-', date: '2026 M05 21' },
        { id: 5, title: 'takrorlash', video: '1', hwStatus: 'Bajarilmagan', hwDeadline: '2026 M05 19 20:00', date: '2026 M05 19' },
        { id: 6, title: 'Nodejs', video: '1', hwStatus: 'Qabul qilingan', hwDeadline: '2026 M05 14 20:00', date: '2026 M05 14' },
        { id: 7, title: 'Html asoslari', video: '1', hwStatus: 'Qaytarilgan', hwDeadline: '2026 M05 12 20:00', date: '2026 M05 12' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Qaytarilgan': return 'bg-[#fbb630]';
            case 'Qabul qilingan': return 'bg-[#50bc5f]';
            case 'Berilmagan': return 'bg-[#7b809a]';
            case 'Bajarilmagan': return 'bg-[#f04445]';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
            <div className="flex">
                <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 w-full overflow-hidden">
                    <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} onSidebarClose={() => setIsSidebarOpen(false)} />
                    
                    <div className="p-[20px] md:p-[30px]">
                        <div className="flex items-center gap-4 mb-4">
                            <button 
                                onClick={() => router.push('/dashboard/my-groups')}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left text-gray-600"></i>
                            </button>
                            <h2 className="text-[20px] font-bold text-gray-800">n105</h2>
                        </div>
                        <div className="bg-white rounded-[12px] p-[24px] shadow-sm">
                            <div className="mb-6 flex flex-col gap-2">
                                <h3 className="text-[#8c94a3] font-[500] text-[15px]">Uy vazifa statusi</h3>
                                <div className="relative inline-block w-[200px]">
                                    <select className="appearance-none w-full bg-white border border-[#c6a27a] text-gray-700 py-2 px-4 pr-8 rounded-[4px] leading-tight focus:outline-none focus:border-[#c6a27a] font-medium cursor-pointer">
                                        <option>Barchasi</option>
                                        <option className='bg-yellow-500 text-white'>Qaytarilgan</option>
                                        <option className='bg-green-500 text-white'>Qabul qilingan</option>
                                        <option className='bg-gray-500 text-white'>Berilmagan</option>
                                        <option className='bg-red-500' text-white>Bajarilmagan</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-800">
                                        <i className="fa-solid fa-caret-down text-[14px]"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[25%]">Mavzular</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[15%]">Video</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[20%]">Uyga vazifa Holati</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[25%]">Uyga vazifa tugash vaqti</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[15%]">Dars sanasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lessons.map((lesson) => (
                                            <tr 
                                                key={lesson.id} 
                                                onClick={() => router.push(`/dashboard/my-groups/${id}/lesson/${lesson.id}`)}
                                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                            >
                                                <td className="py-4 px-4 text-gray-700 text-[14px] font-medium">{lesson.title}</td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full border border-[#60a5fa] text-[#60a5fa] text-[13px] font-medium">
                                                        {lesson.video}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center justify-center text-white text-[13px] font-medium px-4 py-1.5 rounded-[4px] min-w-[120px] ${getStatusStyle(lesson.hwStatus)}`}>
                                                        {lesson.hwStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-700 text-[14px]">{lesson.hwDeadline}</td>
                                                <td className="py-4 px-4 text-gray-700 text-[14px]">{lesson.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
