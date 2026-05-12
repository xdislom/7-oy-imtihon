import React, { useState } from 'react'
import Sidebar from "../components/Sidebar"
import { Button, Checkbox } from "@mui/material"

const teachers = [
    { id: 1, name: "Qwerty qwerty", groups: ["Label", "Label", "Label", "+4"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 2, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 3, name: "Qwerty qwerty", groups: ["Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 4, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 5, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 6, name: "Qwerty qwerty", groups: ["Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 7, name: "Qwerty qwerty", groups: ["Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 8, name: "Qwerty qwerty", groups: ["Label", "Label", "LabelLabel", "+1"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 9, name: "Qwerty qwerty", groups: ["Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
    { id: 10, name: "Qwerty qwerty", groups: ["Label", "Label", "Label"], phone: "+998(33)4082808", birthDate: "24 Jan 2022", createdDate: "24 Jan 2022", coins: "123 123" },
]

export default function Teachers() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <div className="max-w-[1600px] m-auto relative">
            <div className="flex">
                <Sidebar />
                <div className="w-full min-h-screen p-[30px] bg-gray-50">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-[24px]">
                        <div>
                            <h2 className="text-[26px] font-[700] mb-[4px]">O'qituvchilar</h2>
                            <p className="text-gray-500 text-[14px]">
                                Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz. Har bir o'qituvchining ismi, fanlari va aloqa ma'lumotlari keltirilgan.
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
                        <Button variant="outlined" sx={{ color: 'gray', borderColor: '#e5e7eb', textTransform: 'none', borderRadius: '8px' }}>
                            <i className="fa-solid fa-sliders mr-2"></i> Filters
                        </Button>
                        <div className="flex items-center gap-[20px]">
                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-400"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search"
                                    className="pl-[36px] pr-[12px] py-[8px] border border-gray-200 rounded-[8px] outline-none w-[280px]"
                                />
                            </div>
                            <div className="flex items-center gap-[6px] text-gray-500 cursor-pointer hover:text-purple-600">
                                <span className="text-[14px]">Arxiv</span>
                                <i className="fa-solid fa-box-archive"></i>
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex gap-[10px] mb-[16px]">
                        <button className="flex items-center gap-[8px] px-[12px] py-[6px] border border-gray-200 rounded-[8px] bg-white text-gray-600 text-[13px] hover:bg-gray-50">
                            <i className="fa-solid fa-cloud-arrow-up"></i> Export
                        </button>
                        <button className="flex items-center gap-[8px] px-[12px] py-[6px] border border-red-100 rounded-[8px] bg-white text-red-500 text-[13px] hover:bg-red-50">
                            <i className="fa-regular fa-trash-can"></i> Delete
                        </button>
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
                                    <th className="p-[16px]">Coin</th>
                                    <th className="p-[16px] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-gray-700">
                                {teachers.map((teacher, index) => (
                                    <tr key={teacher.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="p-[16px]"><Checkbox size="small" defaultChecked={index === 0 || index === 1 || index === 4 || index === 7} /></td>
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
                                            <div className="flex items-center gap-[6px]">
                                                <div className="w-[12px] h-[12px] bg-yellow-500 rounded-full"></div>
                                                <span className="font-[600]">{teacher.coins}</span>
                                            </div>
                                        </td>
                                        <td className="p-[16px]">
                                            <div className="flex items-center justify-center gap-[12px] text-gray-400">
                                                <div className="flex items-center border border-gray-200 rounded-[6px] overflow-hidden">
                                                    <button className="px-[8px] py-[2px] border-r border-gray-200 hover:bg-gray-50 text-red-500">-</button>
                                                    <button className="px-[8px] py-[2px] hover:bg-gray-50 text-green-500">+</button>
                                                </div>
                                                <i className="fa-regular fa-eye cursor-pointer hover:text-purple-600"></i>
                                                <i className="fa-solid fa-cloud-arrow-down cursor-pointer hover:text-purple-600"></i>
                                                <i className="fa-regular fa-trash-can cursor-pointer hover:text-red-500"></i>
                                                <i className="fa-regular fa-pen-to-square cursor-pointer hover:text-purple-600"></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-[24px]">
                        <button className="px-[16px] py-[8px] border border-gray-200 rounded-[8px] bg-white text-gray-600 text-[14px] hover:bg-gray-50 flex items-center gap-[8px]">
                            <i className="fa-solid fa-arrow-left"></i> Previous
                        </button>
                        <div className="flex gap-[4px]">
                            {[1, 2, 3, "...", 8, 9, 10].map((page, i) => (
                                <button 
                                    key={i} 
                                    className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] text-[14px] transition-colors ${
                                        page === 1 ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="px-[16px] py-[8px] border border-gray-200 rounded-[8px] bg-white text-gray-600 text-[14px] hover:bg-gray-50 flex items-center gap-[8px]">
                            Next <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side Drawer (Add Teacher Panel) */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-50 flex justify-end"
                    onClick={() => setIsDrawerOpen(false)}
                >
                    <div 
                        className="w-[450px] h-full bg-white shadow-2xl flex flex-col animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-[24px] border-b relative">
                            <h3 className="text-[20px] font-[600] mb-1">O'qituvchi qoshish</h3>
                            <p className="text-[13px] text-gray-500">Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin.</p>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                            ></i>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[24px]">
                            {/* Telefon raqam */}
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Telefon raqam</label>
                                <input 
                                    type="text" 
                                    placeholder="+998"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Mail */}
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Mail</label>
                                <div className="relative">
                                    <i className="fa-regular fa-envelope absolute left-[12px] top-[12px] text-gray-400"></i>
                                    <input 
                                        type="email" 
                                        placeholder="Elektron pochtani kiriting"
                                        className="w-full pl-[40px] pr-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* FIO */}
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">O'qituvchi FIO</label>
                                <input 
                                    type="text" 
                                    placeholder="Ma'lumotni kiriting"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Tug'ilgan sanasi */}
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Tug'ilgan sanasi</label>
                                <div className="relative">
                                    <i className="fa-regular fa-calendar absolute left-[12px] top-[12px] text-gray-400"></i>
                                    <input 
                                        type="text" 
                                        placeholder="01.03.1990"
                                        className="w-full pl-[40px] pr-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Guruh */}
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Guruh</label>
                                <div className="relative">
                                    <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-400"></i>
                                    <div className="w-full pl-[40px] pr-[12px] py-[8px] border border-gray-200 rounded-[10px] flex flex-wrap gap-[6px]">
                                        <span className="px-[8px] py-[2px] bg-gray-100 border border-gray-200 rounded-[6px] text-[12px] flex items-center gap-[6px]">
                                            dFDFASC <i className="fa-solid fa-xmark text-[10px] cursor-pointer"></i>
                                        </span>
                                        <span className="px-[8px] py-[2px] bg-gray-100 border border-gray-200 rounded-[6px] text-[12px] flex items-center gap-[6px]">
                                            JDCCXH <i className="fa-solid fa-xmark text-[10px] cursor-pointer"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Jinsi */}
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Jinsi</label>
                                <div className="flex gap-[20px]">
                                    <label className="flex items-center gap-[8px] cursor-pointer">
                                        <input type="radio" name="gender" className="w-[18px] h-[18px] accent-purple-600" />
                                        <span className="text-[14px]">Erkak</span>
                                    </label>
                                    <label className="flex items-center gap-[8px] cursor-pointer">
                                        <input type="radio" name="gender" className="w-[18px] h-[18px] accent-purple-600" />
                                        <span className="text-[14px]">Ayol</span>
                                    </label>
                                </div>
                            </div>

                            {/* Surati */}
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Surati</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-[14px] p-[24px] text-center hover:border-purple-300 transition-colors cursor-pointer">
                                    <div className="w-[48px] h-[48px] bg-gray-50 rounded-[10px] flex items-center justify-center m-auto mb-[12px] border border-gray-100">
                                        <i className="fa-solid fa-cloud-arrow-up text-gray-400"></i>
                                    </div>
                                    <p className="text-[14px] font-[500] mb-1"><span className="text-purple-600">Click to upload</span> or drag and drop</p>
                                    <p className="text-[12px] text-gray-400">JPG or PNG (max. 800x800px)</p>
                                </div>
                            </div>

                            <button className="text-[14px] text-purple-600 font-[500] hover:underline flex items-center gap-[6px]">
                                <i className="fa-solid fa-plus text-[12px]"></i> Parol qoshish
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="p-[24px] border-t bg-gray-50 flex gap-[12px] mt-auto">
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
