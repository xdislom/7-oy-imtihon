import React, { useState } from 'react'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Button, Checkbox } from "@mui/material"

const teachers = [
    { id: 1, name: "Ali Valiyev", groups: ["N26", "n105"], phone: "+998976541223", birthDate: "12.12.1990", createdDate: "12.05.2026" },
    { id: 2, name: "Salim Qodirov", groups: ["n105"], phone: "+998977777777", birthDate: "14.01.1987", createdDate: "14.05.2026" },
    { id: 3, name: "Bobur", groups: ["n105"], phone: "+998999999999", birthDate: "14.03.1992", createdDate: "14.05.2026" },
]

const availableGroups = ["N26", "n105"]

export default function Teachers() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGroups, setSelectedGroups] = useState([])
    const [tempSelected, setTempSelected] = useState([])

    const handleAddGroups = () => {
        setSelectedGroups([...new Set([...selectedGroups, ...tempSelected])])
        setIsModalOpen(false)
        setTempSelected([])
    }

    const removeGroup = (group) => {
        setSelectedGroups(selectedGroups.filter(g => g !== group))
    }

    return (
        <div className="max-w-[1600px] m-auto relative bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    {/* Page Content Header */}
                    <div className="flex justify-between items-start mb-[24px] mt-[20px]">
                        <div>
                            <h2 className="text-[28px] font-[700] mb-[4px]">O'qituvchilar</h2>
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
                                sx={{ bgcolor: '#7c3aed', textTransform: 'none', borderRadius: '10px', fontWeight: 600, px: 3 }}
                            >
                                + O'qituvchi qo'shish
                            </Button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white p-[16px] rounded-[16px] shadow-sm flex justify-between items-center mb-[20px] border border-gray-100">
                        <div className="flex items-center gap-[12px]">
                            <Button variant="outlined" sx={{ color: 'gray', borderColor: '#e5e7eb', textTransform: 'none', borderRadius: '8px' }}>
                                Arxiv
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
                                    className="pl-[36px] pr-[12px] py-[8px] border border-gray-200 rounded-[10px] outline-none w-[280px] focus:border-purple-300 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Teachers Table */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-gray-400 text-[12px] font-[600] tracking-wider uppercase">
                                <tr>
                                    <th className="p-[16px] w-[40px]"><Checkbox size="small" /></th>
                                    <th className="p-[16px]">Nomi &darr;</th>
                                    <th className="p-[16px]">Guruh</th>
                                    <th className="p-[16px]">Telefon raqamlari</th>
                                    <th className="p-[16px]">Tug'ilgan sanasi</th>
                                    <th className="p-[16px]">Yaratilgan sana</th>
                                    <th className="p-[16px] text-center">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-gray-700">
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-[16px]"><Checkbox size="small" /></td>
                                        <td className="p-[16px]">
                                            <div className="flex items-center gap-[12px]">
                                                <div className="w-[36px] h-[36px] rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-[700] text-[13px]">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <span className="font-[600] text-gray-800">{teacher.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-[16px]">
                                            <div className="flex gap-[6px] flex-wrap">
                                                {teacher.groups.map((group, i) => (
                                                    <span key={i} className="px-[10px] py-[3px] bg-gray-50 border border-gray-100 rounded-full text-[11px] font-[600] text-gray-500">
                                                        {group}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-[16px] font-[500] text-gray-600">{teacher.phone}</td>
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
                        <div className="p-[24px] border-b relative">
                            <h3 className="text-[20px] font-[700] mb-1">O'qituvchi qo'shish</h3>
                            <p className="text-[13px] text-gray-500">Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin.</p>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                            ></i>
                        </div>

                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[20px]">
                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Telefon raqam</label>
                                <input 
                                    type="text" 
                                    defaultValue="+998"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 font-[500]"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Mail</label>
                                <input 
                                    type="email" 
                                    placeholder="Elektron pochtani kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">O'qituvchi FIO</label>
                                <input 
                                    type="text" 
                                    placeholder="Ma'lumotni kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Manzil</label>
                                <input 
                                    type="text" 
                                    placeholder="Manzilni kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Parol</label>
                                <input 
                                    type="password" 
                                    placeholder="Parolni kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Guruh</label>
                                <div className="flex flex-wrap gap-[8px] mb-3">
                                    {selectedGroups.map(group => (
                                        <div key={group} className="flex items-center gap-2 bg-purple-50 px-[12px] py-[6px] rounded-[10px] border border-purple-100 text-[13px] font-[600] text-purple-600 group hover:bg-purple-100 transition-colors">
                                            {group}
                                            <i className="fa-solid fa-xmark cursor-pointer text-purple-300 hover:text-red-500" onClick={() => removeGroup(group)}></i>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-[14px] border border-gray-200 rounded-[12px] flex items-center justify-center gap-[8px] text-[#7c3aed] font-[700] hover:bg-purple-50 transition-colors border-dashed border-2"
                                >
                                    <i className="fa-solid fa-plus"></i> Qo'shish
                                </button>
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Surati</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-[20px] p-[30px] flex flex-col items-center justify-center text-center hover:border-purple-300 transition-colors cursor-pointer bg-white">
                                    <div className="w-[48px] h-[48px] bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-cloud-arrow-up text-gray-300 text-[20px]"></i>
                                    </div>
                                    <p className="text-[14px] font-[700] text-[#2d3748] mb-1">
                                        <span className="text-[#7c3aed]">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-[12px] text-gray-400 font-[500]">JPG or PNG (max. 800x800px)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-[24px] border-t bg-white flex gap-[12px]">
                            <button className="flex-1 py-[12px] text-[#4a5568] font-[700] border border-gray-200 rounded-[12px] bg-[#edf2f7] hover:bg-gray-200 transition-colors" onClick={() => setIsDrawerOpen(false)}>Bekor qilish</button>
                            <button className="flex-1 py-[12px] bg-[#6366f1] text-white font-[700] rounded-[12px] hover:bg-indigo-700 transition-colors shadow-sm" onClick={() => setIsDrawerOpen(false)}>Saqlash</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guruhga biriktirish Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-full max-w-[400px] rounded-[24px] shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-[24px] relative">
                            <h3 className="text-[18px] font-[700] text-gray-800 mb-1">Guruhga biriktirish</h3>
                            <p className="text-[13px] text-gray-500 mb-[20px]">Bir yoki bir nechta guruhni tanlang</p>
                            <i className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[18px] hover:text-red-500" onClick={() => setIsModalOpen(false)}></i>

                            <div className="relative mb-[16px]">
                                <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-400"></i>
                                <input 
                                    type="text" 
                                    placeholder="Guruh qidirish..."
                                    className="w-full pl-[36px] pr-[12px] py-[10px] bg-gray-50/50 border border-gray-100 rounded-[12px] outline-none text-[14px] focus:border-purple-300"
                                />
                            </div>

                            <div className="space-y-[2px] max-h-[300px] overflow-y-auto mb-[24px] border border-gray-100 rounded-[16px]">
                                {availableGroups.map(group => (
                                    <label key={group} className="flex items-center gap-[12px] p-[12px] hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                        <Checkbox 
                                            size="small" 
                                            checked={tempSelected.includes(group)}
                                            onChange={(e) => {
                                                if (e.target.checked) setTempSelected([...tempSelected, group])
                                                else setTempSelected(tempSelected.filter(g => g !== group))
                                            }}
                                        />
                                        <span className="text-[14px] font-[500] text-gray-700">{group}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-[12px]">
                                <button className="flex-1 py-[10px] text-gray-700 font-[600] border border-gray-200 rounded-[12px] hover:bg-gray-50" onClick={() => setIsModalOpen(false)}>Bekor qilish</button>
                                <button className="flex-1 py-[10px] bg-[#c3baff] text-[#7c3aed] font-[700] rounded-[12px] hover:bg-[#b0a5ff] transition-colors" onClick={handleAddGroups}>Qo'shish</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}} />
        </div>
    )
}
