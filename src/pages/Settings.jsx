import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Button } from "@mui/material"

const tabs = [
    "Kurslar", "Xonalar", "Filiallar", "Hodimlar",
    "Rollar"
]

const filialTabs = ["Arxiv"]

const cardColors = [
    "bg-white",
    "bg-white",
    "bg-yellow-50 border-yellow-200",
    "bg-green-50 border-green-200",
    "bg-blue-50 border-blue-200",
    "bg-pink-50 border-pink-200",
]

const courses = [
    { id: 1, title: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with. A li...", duration: "90 min", period: "3 oy", price: "1 000 000 mln", color: cardColors[0] },
    { id: 2, title: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with. A li...", duration: "90 min", period: "3 oy", price: "1 000 000 mln", color: cardColors[1] },
    { id: 3, title: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with. A li...", duration: "90 min", period: "3 oy", price: "1 000 000 mln", color: cardColors[2] },
    { id: 4, title: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with. A li...", duration: "90 min", period: "3 oy", price: "1 000 000 mln", color: cardColors[3] },
    { id: 5, title: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with. A li...", duration: "90 min", period: "3 oy", price: "1 000 000 mln", color: cardColors[4] },
    { id: 6, title: "Human Resources Manager", desc: "A little about the company and the team that you'll be working with. A li...", duration: "90 min", period: "3 oy", price: "1 000 000 mln", color: cardColors[5] },
]

const rooms = [
    { id: 1, name: "genious room", capacity: 15 },
    { id: 2, name: "Impact room", capacity: 12 },
    { id: 3, name: "1A", capacity: 25 },
    { id: 4, name: "205-xona", capacity: 32 },
    { id: 5, name: "16-xona", capacity: 18 },
    { id: 6, name: "5 xona", capacity: 30 },
    { id: 7, name: "IELTS with Islombek", capacity: 20 },
    { id: 8, name: "Beginner", capacity: 18 },
    { id: 9, name: "99", capacity: 25 },
]

const xonalarFilialTabs = ["Arxiv"]

function XonalarTab() {
    const [activeFilial, setActiveFilial] = useState("Arxiv")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-[20px]">
                <div className="flex items-center gap-3">
                    <h3 className="text-[22px] font-[600]">Xonalar</h3>
                </div>
                <Button
                    variant="contained"
                    onClick={() => setIsDrawerOpen(true)}
                    sx={{ bgcolor: '#7c3aed', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    + Xonani qo'shish
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                {rooms.map(room => (
                    <div key={room.id} className="bg-white rounded-[12px] p-[16px] border border-gray-100 flex justify-between items-center shadow-sm">
                        <div>
                            <p className="text-[15px] font-[600] text-gray-800">{room.name}</p>
                            <p className="text-[13px] text-gray-500">Sig'imi: {room.capacity}</p>
                        </div>
                        <div className="flex gap-[8px]">
                            <i className="fa-regular fa-trash-can text-gray-400 hover:text-red-500 cursor-pointer"></i>
                            <i className="fa-regular fa-pen-to-square text-gray-400 hover:text-purple-600 cursor-pointer"></i>
                        </div>
                    </div>
                ))}
            </div>

            {/* Xona qo'shish Drawer */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-[200] flex justify-end"
                    onClick={() => setIsDrawerOpen(false)}
                >
                    <div 
                        className="w-[450px] h-full bg-white shadow-2xl flex flex-col animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-[24px] border-b relative">
                            <h3 className="text-[20px] font-[600] mb-1">Xona qo'shish</h3>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                            ></i>
                        </div>
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[24px]">
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Xona nomi</label>
                                <input 
                                    type="text" 
                                    placeholder="Xona nomini kiriting"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Sig'imi (kishi)</label>
                                <input 
                                    type="number" 
                                    placeholder="Masalan: 15"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>
                        <div className="p-[24px] border-t bg-gray-50 flex gap-[12px]">
                            <button className="flex-1 py-[10px] text-gray-600 font-[600] border border-gray-200 rounded-[10px] bg-white hover:bg-gray-100" onClick={() => setIsDrawerOpen(false)}>Bekor qilish</button>
                            <button className="flex-1 py-[10px] bg-purple-600 text-white font-[600] rounded-[10px] hover:bg-purple-700" onClick={() => setIsDrawerOpen(false)}>Saqlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function KurslarTab() {
    const [activeFilial, setActiveFilial] = useState("Arxiv")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-[20px]">
                <h3 className="text-[22px] font-[600]">Kurslar</h3>
                <Button
                    variant="contained"
                    onClick={() => setIsDrawerOpen(true)}
                    sx={{ bgcolor: '#7c3aed', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    + Kurs qo'shish
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                {courses.map(course => (
                    <div key={course.id} className={`rounded-[14px] p-[16px] border ${course.color} min-h-[160px] flex flex-col justify-between shadow-sm`}>
                        <div>
                            <p className="text-[14px] font-[600] text-gray-800 mb-[6px]">{course.title}</p>
                            <p className="text-[12px] text-gray-500 leading-[1.4]">{course.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-[12px]">
                            <span className="text-[11px] bg-white border border-gray-200 rounded-[6px] px-[8px] py-[3px]">{course.price}</span>
                            <div className="flex gap-[6px]">
                                <i className="fa-regular fa-trash-can text-gray-400 hover:text-red-500 cursor-pointer"></i>
                                <i className="fa-regular fa-pen-to-square text-gray-400 hover:text-purple-600 cursor-pointer"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kurs qo'shish Drawer */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-[200] flex justify-end"
                    onClick={() => setIsDrawerOpen(false)}
                >
                    <div 
                        className="w-[450px] h-full bg-white shadow-2xl flex flex-col animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-[24px] border-b relative">
                            <h3 className="text-[20px] font-[600] mb-1">Kurs qo'shish</h3>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                            ></i>
                        </div>
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[24px]">
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Kurs nomi</label>
                                <input 
                                    type="text" 
                                    placeholder="Kurs nomini kiriting"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Kurs narxi</label>
                                <input 
                                    type="text" 
                                    placeholder="Masalan: 1 200 000"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>
                        <div className="p-[24px] border-t bg-gray-50 flex gap-[12px]">
                            <button className="flex-1 py-[10px] text-gray-600 font-[600] border border-gray-200 rounded-[10px] bg-white hover:bg-gray-100" onClick={() => setIsDrawerOpen(false)}>Bekor qilish</button>
                            <button className="flex-1 py-[10px] bg-purple-600 text-white font-[600] rounded-[10px] hover:bg-purple-700" onClick={() => setIsDrawerOpen(false)}>Saqlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Settings() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "Kurslar"
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const setActiveTab = (tab) => {
        setSearchParams({ tab })
    }

    const isWhiteBackground = activeTab === "Kurslar" || activeTab === "Xonalar"

    return (
        <div className="max-w-[1600px] m-auto bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col">
                    <div className="px-[20px] md:px-[40px] bg-gray-50 pb-[20px]">
                        <Header onMenuClick={() => setIsSidebarOpen(true)} />
                        
                        <div className="mt-[20px]">
                            <h2 className="text-[26px] font-[700] mb-[4px]">Boshqarish</h2>
                            <p className="text-gray-500 text-[14px] mb-[24px]">
                                Tizim parametrlarini va bo'limlarini shu yerda boshqarishingiz mumkin.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-[4px] border-b border-gray-200">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-[16px] py-[10px] text-[14px] font-[500] border-b-2 transition-colors ${activeTab === tab
                                            ? "border-purple-600 text-purple-600"
                                            : "border-transparent text-gray-500 hover:text-purple-500"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`flex-1 px-[20px] md:px-[40px] pt-[30px] pb-[40px] ${isWhiteBackground ? 'bg-white' : 'bg-gray-50'}`}>
                        {activeTab === "Kurslar" && <KurslarTab />}
                        {activeTab === "Xonalar" && <XonalarTab />}
                        {activeTab !== "Kurslar" && activeTab !== "Xonalar" && (
                            <div className="text-gray-400 text-[16px] mt-[40px]">
                                {activeTab} bo'limi tez kunda qo'shiladi...
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}} />
        </div>
    )
}
