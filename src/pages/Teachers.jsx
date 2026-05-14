import React, { useState } from 'react'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Button, Checkbox } from "@mui/material"

const teachers = [
    { id: 1, name: "Qwerty qwerty", groups: ["Label", "Label", "Label", "+4"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 2, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 3, name: "Qwerty qwerty", groups: ["Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 4, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 5, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 6, name: "Qwerty qwerty", groups: ["Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 7, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 8, name: "Qwerty qwerty", groups: ["Label", "Label", "LabelLabel", "+1"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 9, name: "Qwerty qwerty", groups: ["Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
    { id: 10, name: "Qwerty qwerty", groups: ["Label", "Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022" },
]

export default function Teachers() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="max-w-[1600px] m-auto relative bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    {/* Page Content Header */}
                    <div className="flex justify-between items-start mb-[24px] mt-[20px]">
                        <div>
                            <h2 className="text-[26px] font-[700] mb-[4px]">O'qituvchilar</h2>
                            <p className="text-gray-500 text-[14px]">
                                Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz.
                            </p>
                        </div>
                        <div className="flex gap-[12px]">
                            <Button variant="outlined" sx={{ color: 'gray', borderColor: '#e5e7eb', textTransform: 'none', borderRadius: '10px', bgcolor: 'white' }}>
                                <i className="fa-solid fa-cloud-arrow-up mr-2"></i> Export
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => setIsDrawerOpen(true)}
                                sx={{ bgcolor: '#7c3aed', textTransform: 'none', borderRadius: '10px', fontWeight: 600 }}
                            >
                                + O'qituvchi qo'shish
                            </Button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-[16px] rounded-[14px] shadow-sm flex justify-between items-center mb-[20px] border border-gray-100">
                        <div className="flex items-center gap-[12px]">
                            <Button variant="outlined" sx={{ color: 'gray', borderColor: '#e5e7eb', textTransform: 'none', borderRadius: '8px' }}>
                                <i className="fa-solid fa-box-archive mr-2"></i> Arxiv
                            </Button>
                            <Button variant="outlined" sx={{ color: 'gray', borderColor: '#e5e7eb', textTransform: 'none', borderRadius: '8px' }}>
                                <i className="fa-solid fa-sliders mr-2"></i> Filters
                            </Button>
                        </div>
                        <div className="flex items-center gap-[20px]">
                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-400"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search"
                                    className="pl-[36px] pr-[12px] py-[8px] border border-gray-200 rounded-[8px] outline-none w-[280px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Teachers Table */}
                    <div className="bg-white rounded-[14px] border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 text-[12px] uppercase font-[600]">
                                <tr>
                                    <th className="p-[16px] w-[40px]"><Checkbox size="small" /></th>
                                    <th className="p-[16px]">Nomi <i className="fa-solid fa-arrow-down ml-1"></i></th>
                                    <th className="p-[16px]">Guruh</th>
                                    <th className="p-[16px]">Telefon raqamlari</th>
                                    <th className="p-[16px]">Tug'ilgan sanasi</th>
                                    <th className="p-[16px]">Yaratilgan sana</th>
                                    <th className="p-[16px] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-gray-700">
                                {teachers.map((teacher, index) => (
                                    <tr key={teacher.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-[16px]"><Checkbox size="small" /></td>
                                        <td className="p-[16px]">
                                            <div className="flex items-center gap-[10px]">
                                                <div className="w-[32px] h-[32px] rounded-full bg-gray-200 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/150?u=${teacher.id}`} alt="avatar" />
                                                </div>
                                                <span className="font-[500]">{teacher.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-[16px]">
                                            <div className="flex gap-[4px] flex-wrap">
                                                {teacher.groups.map((group, i) => (
                                                    <span key={i} className="px-[8px] py-[2px] bg-gray-50 border border-gray-200 rounded-[4px] text-[11px] text-gray-500">
                                                        {group}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-[16px]">{teacher.phone}</td>
                                        <td className="p-[16px] text-gray-500">{teacher.birthDate}</td>
                                        <td className="p-[16px] text-gray-500">{teacher.createdDate}</td>
                                        <td className="p-[16px]">
                                            <div className="flex items-center justify-center gap-[12px] text-gray-400">
                                                <i className="fa-regular fa-eye cursor-pointer hover:text-purple-600"></i>
                                                <i className="fa-regular fa-trash-can cursor-pointer hover:text-red-500"></i>
                                                <i className="fa-regular fa-pen-to-square cursor-pointer hover:text-purple-600"></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Side Drawer (Add Teacher Panel) */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-[200] flex justify-end"
                    onClick={() => setIsDrawerOpen(false)}
                >
                    <div 
                        className="w-[450px] h-full bg-white shadow-2xl flex flex-col animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="p-[24px] border-b relative">
                            <h3 className="text-[20px] font-[600] mb-1">O'qituvchi qoshish</h3>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                            ></i>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[24px]">
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">O'qituvchi FIO</label>
                                <input 
                                    type="text" 
                                    placeholder="Ism va familiyani kiriting"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-[24px] border-t bg-gray-50 flex gap-[12px]">
                            <button 
                                className="flex-1 py-[10px] text-gray-600 font-[600] border border-gray-200 rounded-[10px] bg-white hover:bg-gray-100 transition-colors"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                className="flex-1 py-[10px] bg-purple-600 text-white font-[600] rounded-[10px] hover:bg-purple-700 transition-colors"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
