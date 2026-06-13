"use client";

import { useEffect, useState } from 'react'
import { useRouter, useParams } from "next/navigation";

import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

const examTopics = [
    "Modul 1: Kirish",
    "Modul 2: Asosiy tushunchalar",
    "Modul 3: Amaliyot",
    "Yakuniy imtihon"
]

export default function GroupExamCreate() {
    const params = useParams(); const groupId = params?.id as string
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)
    const [endDate, setEndDate] = useState("")
    const [endTime, setEndTime] = useState("")
    const [saving, setSaving] = useState(false)

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) setFile(selectedFile)
    }

    const handleSubmit = async () => {
        // In a real app we would post this data to the API
        // For now, we simulate success and navigate back
        setSaving(true)
        setTimeout(() => {
            router.push(`/classes/groups/${groupId}?tab=lessons`)
        }, 800)
    }

    return (
        <div className="w-full bg-[#f4f4f5] min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <div className="w-full max-w-[800px] mt-[20px]">

                        {/* Sarlavha / Header */}
                        <div className="flex items-center gap-[12px] mb-[32px]">
                            <button 
                                onClick={() => router.push(-1)} 
                                className="text-gray-900 hover:text-gray-600 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-left text-[20px] font-[800]"></i>
                            </button>
                            <h1 className="text-[24px] font-[800] text-gray-900 tracking-tight">Imtihon yaratish</h1>
                        </div>

                        <div className="space-y-[24px]">

                            {/* Mavzu */}
                            <div>
                                <label className="block text-[15px] font-[700] text-gray-800 mb-[10px]">
                                    Mavzu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={`w-full appearance-none px-[20px] py-[16px] rounded-[8px] border border-gray-200 outline-none text-[15px] bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm ${!title ? 'text-gray-500' : 'text-gray-900'}`}
                                    >
                                        <option value="" disabled>Mavzulardan birini tanlang</option>
                                        {examTopics.map(topic => (
                                            <option key={topic} value={topic}>{topic}</option>
                                        ))}
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-[20px] top-1/2 -translate-y-1/2 text-gray-600 text-[14px] pointer-events-none"></i>
                                </div>
                            </div>

                            {/* Izoh */}
                            <div>
                                <label className="block text-[15px] font-[700] text-gray-800 mb-[10px]">
                                    Izoh <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    rows="6"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Vazifa haqida qo'shimcha ma'lumot kiriting..."
                                    className="w-full border border-gray-200 rounded-[8px] px-[20px] py-[20px] outline-none resize-y text-[15px] text-gray-900 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm placeholder:text-gray-400"
                                ></textarea>
                            </div>

                            {/* Yuklash / Upload fayl */}
                            <div>
                                <label 
                                    className={`flex flex-col items-center justify-center w-full py-[36px] border-[2px] border-dashed rounded-[10px] cursor-pointer transition-colors bg-white hover:border-[#8B5CF6] border-gray-300`}
                                >
                                    <i className="fa-solid fa-cloud-arrow-up text-[#8B5CF6] text-[32px] mb-[16px]"></i>
                                    <span className="text-[15px] font-[500] text-gray-500">
                                        {file ? file.name : 'Faylni tanlash yoki shu yerga tashlang'}
                                    </span>
                                    <input type="file" onChange={handleFileChange} className="hidden" />
                                </label>
                                {file && (
                                    <div className="flex justify-center mt-[12px]">
                                        <button 
                                            type="button" 
                                            onClick={() => setFile(null)}
                                            className="text-[14px] text-red-500 font-[600] hover:underline"
                                        >
                                            Faylni bekor qilish
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Tugmalar / Actions */}
                            <div className="flex items-center gap-[20px] pt-[12px]">
                                <button 
                                    type="button" 
                                    onClick={() => router.push(-1)}
                                    disabled={saving}
                                    className="flex-1 py-[16px] border border-gray-200 bg-white rounded-[10px] text-gray-700 font-[700] text-[16px] hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="flex-1 py-[16px] bg-[#10b981] text-white rounded-[10px] font-[700] text-[16px] hover:bg-[#059669] transition-colors disabled:opacity-70 flex items-center justify-center gap-[10px] shadow-sm"
                                >
                                    {saving && <i className="fa-solid fa-spinner fa-spin"></i>}
                                    E'lon qilish
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
