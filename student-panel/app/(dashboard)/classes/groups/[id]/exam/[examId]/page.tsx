"use client";

import { useState } from 'react'
import { useRouter, useParams } from "next/navigation";

import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function GroupExamDetail() {
    const params = useParams(); const groupId = params?.id as string
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("qaytarilganlar")

    const tabs = [
        { id: "kutayotganlar", label: "Kutayotganlar" },
        { id: "qaytarilganlar", label: "Qaytarilganlar", badge: 2 },
        { id: "qabul_qilinganlar", label: "Qabul qilinganlar", badge: 15 },
        { id: "bajarilmagan", label: "Bajarilmagan", badge: 1 },
    ]

    const acceptedStudents = [
        { id: 1, name: "Dilshodbek O'ktamjon o'g'li Tokhirov", submitted: "24 Apr, 2026 12:56", checked: "27 Apr, 2026 10:30", score: 65 },
        { id: 2, name: "Rahmonbergan Otabek o'g'li Mahmudov", submitted: "24 Apr, 2026 10:42", checked: "24 Apr, 2026 11:32", score: 85 },
        { id: 3, name: "Mirsaid Abduqulov", submitted: "24 Apr, 2026 11:59", checked: "24 Apr, 2026 14:50", score: 70 },
        { id: 4, name: "Oydin Kamolovna Qalandarova", submitted: "24 Apr, 2026 09:27", checked: "29 Apr, 2026 12:17", score: 100 },
        { id: 5, name: "Guliza Ayitqulova", submitted: "24 Apr, 2026 12:41", checked: "24 Apr, 2026 14:40", score: 70 },
        { id: 6, name: "Nozima Abdugapparova", submitted: "24 Apr, 2026 09:27", checked: "24 Apr, 2026 09:47", score: 85 },
    ]

    const returnedStudents = [
        { id: 7, name: "Hojiakabar Nosir o'g'li Yarashov", submitted: "02 Fev, 2026 22:38", checked: "04 Fev, 2026 09:13", deadline: "11 Fev, 2026 12:00" },
        { id: 8, name: "Farrux Nishonaliyev", submitted: "02 Fev, 2026 17:46", checked: "04 Fev, 2026 09:11", deadline: "02 Fev, 2026 23:30" },
    ]

    const failedStudents = [
        { id: 9, name: "Muxammadaziz Rafiqjonov", deadline: "-" }
    ]

    return (
        <div className="w-full bg-[#f4f4f5] min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    {/* Sarlavha / Header Info qismi */}
                    <div className="flex items-center gap-[16px] mt-[16px] mb-[24px]">
                        <button 
                            onClick={() => router.push(-1)}
                            className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] bg-white border border-gray-200 text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[12px] mb-[24px] overflow-hidden">
                        <div className="px-[24px] py-[24px] flex flex-wrap md:flex-nowrap items-center justify-between gap-[24px] border-b border-gray-100">
                            <div className="flex gap-[64px]">
                                <div>
                                    <p className="text-[13px] font-[600] text-gray-400 mb-[4px]">Mavzu</p>
                                    <h2 className="text-[18px] font-[800] text-gray-900">Examination</h2>
                                </div>
                                <div>
                                    <p className="text-[13px] font-[600] text-gray-400 mb-[4px]">Imtihon vaqti</p>
                                    <p className="text-[15px] font-[700] text-gray-900">30 Yan, 2026 12:21 - 30 Yan, 2026 23:59</p>
                                </div>
                            </div>
                            <button className="px-[24px] py-[10px] rounded-[8px] bg-gray-100 text-gray-400 font-[600] text-[14px] cursor-not-allowed">
                                E'lon qilish
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="px-[24px] pt-[20px]">
                            <div className="flex gap-[32px] border-b border-gray-100">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative pb-[12px] text-[15px] font-[700] transition-colors flex items-center gap-[8px] ${
                                            activeTab === tab.id 
                                                ? 'text-gray-900' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab.label}
                                        {tab.badge && (
                                            <span className={`w-[24px] h-[24px] flex items-center justify-center rounded-full text-[13px] font-[800] ${
                                                activeTab === tab.id ? 'bg-[#ffb020] text-white' : 'bg-[#ffb020] text-white'
                                            }`}>
                                                {tab.badge}
                                            </span>
                                        )}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00b87c] rounded-t-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-gray-100 rounded-[12px] overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-[24px] py-[20px] text-left text-gray-500 font-[700] text-[14px]">O'quvchi ismi</th>
                                    
                                    {activeTab !== "bajarilmagan" && (
                                        <>
                                            <th className="px-[24px] py-[20px] text-left text-gray-500 font-[700] text-[14px]">Topshirilgan vaqti</th>
                                            <th className="px-[24px] py-[20px] text-left text-gray-500 font-[700] text-[14px]">Tekshirilgan vaqti</th>
                                        </>
                                    )}
                                    
                                    {activeTab === "qaytarilganlar" || activeTab === "bajarilmagan" ? (
                                        <th className="px-[24px] py-[20px] text-left text-gray-500 font-[700] text-[14px] w-[200px]">Tugash vaqti</th>
                                    ) : (
                                        <th className="px-[24px] py-[20px] text-left text-gray-500 font-[700] text-[14px] w-[120px]">Ball</th>
                                    )}

                                    {activeTab === "qaytarilganlar" ? (
                                        <th className="px-[24px] py-[20px] text-right text-gray-500 font-[700] text-[14px] w-[120px]">Harakatlar</th>
                                    ) : activeTab !== "bajarilmagan" ? (
                                        <th className="px-[24px] py-[20px] w-[60px]"></th>
                                    ) : null}
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === "qabul_qilinganlar" && acceptedStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-[24px] py-[20px] text-gray-900 font-[600] text-[14px]">{student.name}</td>
                                        <td className="px-[24px] py-[20px] text-gray-700 font-[500] text-[14px]">{student.submitted}</td>
                                        <td className="px-[24px] py-[20px] text-gray-700 font-[500] text-[14px]">{student.checked}</td>
                                        <td className="px-[24px] py-[20px] text-gray-900 font-[600] text-[14px]">
                                            <i className="fa-solid fa-bolt text-[#ffb020] mr-[6px]"></i>
                                            {student.score}
                                        </td>
                                        <td className="px-[24px] py-[20px] text-right">
                                            <button className="text-gray-400 hover:text-gray-700 transition-colors">
                                                <i className="fa-solid fa-pencil text-[16px]"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {activeTab === "qaytarilganlar" && returnedStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-[24px] py-[20px] text-gray-900 font-[600] text-[14px]">{student.name}</td>
                                        <td className="px-[24px] py-[20px] text-gray-700 font-[500] text-[14px]">{student.submitted}</td>
                                        <td className="px-[24px] py-[20px] text-gray-700 font-[500] text-[14px]">{student.checked}</td>
                                        <td className="px-[24px] py-[20px] text-gray-700 font-[500] text-[14px]">{student.deadline}</td>
                                        <td className="px-[24px] py-[20px] text-right">
                                            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors ml-auto">
                                                <i className="fa-solid fa-ellipsis-vertical text-[16px]"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {activeTab === "bajarilmagan" && failedStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-[24px] py-[20px] text-gray-900 font-[600] text-[14px]">{student.name}</td>
                                        <td className="px-[24px] py-[20px] text-gray-700 font-[500] text-[14px]">{student.deadline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}
