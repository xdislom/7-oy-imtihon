import { useSearchParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { Button } from "@mui/material"
import { useState } from "react"

const tabs = [
    "Kurslar", "Xonalar", "Filiallar", "Hodimlar",
    "Rollar", "Coin", "Sabablar", "Xabar yuborish", "FAQ", "Telegram bot"
]

const filialTabs = ["Filial 1", "Filial 2", "Arxiv"]

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

const xonalarFilialTabs = ["AICoder markazi", "Fizika va Matematika", "4-maktab", "Niner markazi", "IELTS full mock", "IELTS full mock centre", "Arxiv"]

function XonalarTab() {
    const [activeFilial, setActiveFilial] = useState("AICoder markazi")

    return (
        <div>
            {/* Xonalar header */}
            <div className="flex justify-between items-center mb-[20px]">
                <div className="flex items-center gap-3">
                    <h3 className="text-[22px] font-[600]">Xonalar</h3>
                    <i className="fa-solid fa-rotate text-gray-400 cursor-pointer hover:text-purple-600"></i>
                </div>
                <Button
                    variant="contained"
                    sx={{ bgcolor: '#7c3aed', borderRadius: '10px', textTransform: 'none', fontWeight: 600, display: 'flex', gap: 1 }}
                >
                    <i className="fa-solid fa-plus"></i>
                    Xonani qo'shish
                </Button>
            </div>

            {/* Filial tabs */}
            <div className="flex flex-wrap gap-[8px] mb-[24px]">
                {xonalarFilialTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilial(tab)}
                        className={`px-[16px] py-[6px] rounded-[8px] text-[13px] font-[500] border transition-colors duration-150 cursor-pointer ${activeFilial === tab
                                ? "bg-white text-purple-600 border-purple-200 shadow-sm"
                                : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Room cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                {rooms.map(room => (
                    <div
                        key={room.id}
                        className="bg-white rounded-[12px] p-[16px] border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div>
                            <p className="text-[15px] font-[600] text-gray-800">{room.name}</p>
                            <p className="text-[13px] text-gray-500 mt-1">Sig'imi: {room.capacity}</p>
                        </div>
                        <div className="flex gap-[8px]">
                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fa-regular fa-trash-can text-[16px]"></i>
                            </button>
                            <button className="text-gray-400 hover:text-purple-600 transition-colors">
                                <i className="fa-regular fa-pen-to-square text-[16px]"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function KurslarTab() {
    const [activeFilial, setActiveFilial] = useState("Filial 1")

    return (
        <div>
            {/* Kurslar header */}
            <div className="flex justify-between items-center mb-[20px]">
                <h3 className="text-[22px] font-[600]">Kurslar</h3>
                <Button
                    variant="contained"
                    sx={{ bgcolor: '#7c3aed', borderRadius: '10px', textTransform: 'none', fontWeight: 600, display: 'flex', gap: 1 }}
                >
                    <i className="fa-solid fa-plus"></i>
                    Kurslar qoshish
                </Button>
            </div>

            {/* Filial tabs */}
            <div className="flex gap-[8px] mb-[24px]">
                {filialTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilial(tab)}
                        className={`px-[18px] py-[7px] rounded-[8px] text-[14px] font-[500] border transition-colors duration-150 cursor-pointer ${activeFilial === tab
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Course cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                {courses.map(course => (
                    <div
                        key={course.id}
                        className={`rounded-[14px] p-[16px] border ${course.color} flex flex-col justify-between min-h-[160px]`}
                    >
                        <div>
                            <p className="text-[14px] font-[600] text-gray-800 mb-[6px]">{course.title}</p>
                            <p className="text-[12px] text-gray-500 leading-[1.4]">{course.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-[12px]">
                            <div className="flex gap-[8px] flex-wrap">
                                <span className="text-[11px] bg-white border border-gray-200 rounded-[6px] px-[8px] py-[3px] text-gray-600">{course.duration}</span>
                                <span className="text-[11px] bg-white border border-gray-200 rounded-[6px] px-[8px] py-[3px] text-gray-600">{course.period}</span>
                                <span className="text-[11px] bg-white border border-gray-200 rounded-[6px] px-[8px] py-[3px] text-gray-600">{course.price}</span>
                            </div>
                            <div className="flex gap-[6px] ml-[4px]">
                                <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                    <i className="fa-regular fa-trash-can text-[15px]"></i>
                                </button>
                                <button className="text-gray-400 hover:text-purple-600 transition-colors cursor-pointer">
                                    <i className="fa-regular fa-pen-to-square text-[15px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Settings() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "Kurslar"

    const setActiveTab = (tab) => {
        setSearchParams({ tab })
    }

    return (
        <div className="max-w-[1600px] m-auto">
            <div className="flex">
                <Sidebar />
                <div className="w-full min-h-screen p-[30px] bg-gray-50">
                    {/* Page title */}
                    <h2 className="text-[26px] font-[700] mb-[4px]">Boshqarish</h2>
                    <p className="text-gray-500 text-[14px] mb-[24px]">
                        Ushbu sahifada siz sovg'alarni boshqarish imkoniyatiga ega bo'lasiz. Har bir sovg'a haqida batafsil ma'lumot va yangi sovg'a qo'shish imkoniyat bor.
                    </p>

                    {/* Tab navigation */}
                    <div className="flex flex-wrap gap-[4px] border-b border-gray-200 mb-[28px]">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-[16px] py-[10px] text-[14px] font-[500] cursor-pointer border-b-2 transition-colors duration-150 bg-transparent ${activeTab === tab
                                        ? "border-purple-600 text-purple-600"
                                        : "border-transparent text-gray-500 hover:text-purple-500"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div>
                        {activeTab === "Kurslar" && <KurslarTab />}
                        {activeTab === "Xonalar" && <XonalarTab />}
                        {activeTab !== "Kurslar" && activeTab !== "Xonalar" && (
                            <div className="text-gray-400 text-[16px] mt-[40px]">
                                <i className="fa-solid fa-clock-rotate-left mr-2"></i>
                                <span className="font-[500]">{activeTab}</span> bo'limi tez kunda qo'shiladi...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
