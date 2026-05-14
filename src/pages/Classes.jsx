import React, { useState } from 'react'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Button, Switch, Checkbox, Radio } from "@mui/material"

const groupsData = [
    { 
        id: 1, 
        status: true, 
        name: "N26", 
        course: "Backend", 
        duration: "6 oy", 
        time: "09:30", 
        days: "Du, Se, Chor, Pay, Ju", 
        room: "Autodesk", 
        teacher: "Mohirbek", 
        students: 1 
    },
    { 
        id: 2, 
        status: true, 
        name: "n105", 
        course: "Backend", 
        duration: "6 oy", 
        time: "16:00", 
        days: "Se, Pay, Shan", 
        room: "Autodesk", 
        teacher: "Mohirbek", 
        students: 4 
    },
]

const studentsList = [
    "Ali Valiyev",
    "Salim Qodirov",
    "Bobur",
    "Qodir Salimov"
]

const teachersList = [
    "Mohirbek",
    "Diyorbek",
    "Jaloliddin"
]

export default function Groups() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("Guruhlar")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false)
    
    const [selectedStudents, setSelectedStudents] = useState([])
    const [selectedTeacher, setSelectedTeacher] = useState("")

    return (
        <div className="max-w-[1600px] m-auto bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    {/* Header */}
                    <div className="flex justify-between items-center mt-[20px] mb-[24px]">
                        <h2 className="text-[28px] font-[700]">Guruhlar</h2>
                        <Button 
                            variant="contained" 
                            onClick={() => setIsDrawerOpen(true)}
                            sx={{ 
                                bgcolor: '#7c3aed', 
                                textTransform: 'none', 
                                borderRadius: '10px', 
                                fontWeight: 600,
                                px: 3,
                                '&:hover': { bgcolor: '#6d28d9' }
                            }}
                        >
                            + Guruh qo'shish
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-[8px] mb-[24px]">
                        <button 
                            onClick={() => setActiveTab("Guruhlar")}
                            className={`px-[16px] py-[6px] rounded-[8px] text-[14px] font-[600] transition-colors ${activeTab === "Guruhlar" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}
                        >
                            Guruhlar
                        </button>
                        <button 
                            onClick={() => setActiveTab("Arxiv")}
                            className={`px-[16px] py-[6px] rounded-[8px] text-[14px] font-[600] flex items-center gap-2 transition-colors ${activeTab === "Arxiv" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}
                        >
                            <i className="fa-solid fa-box-archive text-[12px]"></i> Arxiv
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mb-[30px]">
                        <div className="bg-white p-[24px] rounded-[16px] border border-gray-100 shadow-sm relative">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <i className="fa-solid fa-users text-[14px]"></i>
                                <span className="text-[13px] font-[500]">Jami guruhlar</span>
                            </div>
                            <h3 className="text-[32px] font-[700]">2</h3>
                            <i className="fa-solid fa-ellipsis-vertical absolute top-[24px] right-[24px] text-gray-300 cursor-pointer"></i>
                        </div>
                        <div className="bg-white p-[24px] rounded-[16px] border border-gray-100 shadow-sm relative">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <i className="fa-solid fa-user-group text-[14px]"></i>
                                <span className="text-[13px] font-[500]">O'qituvchilar</span>
                            </div>
                            <h3 className="text-[32px] font-[700]">0</h3>
                            <i className="fa-solid fa-ellipsis-vertical absolute top-[24px] right-[24px] text-gray-300 cursor-pointer"></i>
                        </div>
                        <div className="bg-white p-[24px] rounded-[16px] border border-gray-100 shadow-sm relative">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <i className="fa-solid fa-graduation-cap text-[14px]"></i>
                                <span className="text-[13px] font-[500]">O'quvchilar</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-[32px] font-[700]">0</h3>
                                <div className="flex -space-x-2">
                                    <div className="w-[24px] h-[24px] rounded-full bg-black text-white text-[10px] flex items-center justify-center border-2 border-white">I</div>
                                    <div className="w-[24px] h-[24px] rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center border-2 border-white">M</div>
                                    <div className="w-[24px] h-[24px] rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center border-2 border-white">S</div>
                                </div>
                            </div>
                            <i className="fa-solid fa-ellipsis-vertical absolute top-[24px] right-[24px] text-gray-300 cursor-pointer"></i>
                        </div>
                    </div>

                    {/* Groups Table */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-gray-400 text-[12px] font-[600] uppercase tracking-wider">
                                        <th className="py-[16px] px-[24px]">Status</th>
                                        <th className="py-[16px] px-[24px]">Guruh nomi</th>
                                        <th className="py-[16px] px-[24px]">Kurs</th>
                                        <th className="py-[16px] px-[24px]">Davomiyligi</th>
                                        <th className="py-[16px] px-[24px]">Dars vaqti</th>
                                        <th className="py-[16px] px-[24px]">Xona</th>
                                        <th className="py-[16px] px-[24px]">O'qituvchi</th>
                                        <th className="py-[16px] px-[24px] text-center">Talabalar</th>
                                        <th className="py-[16px] px-[24px] text-right"><i className="fa-solid fa-rotate-right cursor-pointer hover:text-purple-600"></i></th>
                                    </tr>
                                </thead>
                                <tbody className="text-[14px]">
                                    {groupsData.map((group) => (
                                        <tr key={group.id} className="border-t border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <td className="py-[16px] px-[24px]">
                                                <div className="flex items-center gap-2">
                                                    <Switch 
                                                        defaultChecked={group.status} 
                                                        size="small" 
                                                        sx={{ 
                                                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c3aed' },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7c3aed' }
                                                        }} 
                                                    />
                                                    <span className="text-[11px] font-[700] text-green-500">FAOL</span>
                                                </div>
                                            </td>
                                            <td className="py-[16px] px-[24px] font-[700] text-gray-800">{group.name}</td>
                                            <td className="py-[16px] px-[24px]">
                                                <span className="px-[12px] py-[4px] bg-purple-50 text-purple-600 rounded-full text-[11px] font-[600]">
                                                    {group.course}
                                                </span>
                                            </td>
                                            <td className="py-[16px] px-[24px] text-gray-600 font-[500]">{group.duration}</td>
                                            <td className="py-[16px] px-[24px]">
                                                <div className="flex flex-col">
                                                    <span className="font-[700] text-gray-800">{group.time}</span>
                                                    <span className="text-[11px] text-gray-400 font-[500]">{group.days}</span>
                                                </div>
                                            </td>
                                            <td className="py-[16px] px-[24px] text-gray-600 font-[500]">{group.room}</td>
                                            <td className="py-[16px] px-[24px] text-gray-600 font-[500]">{group.teacher}</td>
                                            <td className="py-[16px] px-[24px] text-center font-[700] text-gray-800">{group.students}</td>
                                            <td className="py-[16px] px-[24px] text-right">
                                                <i className="fa-solid fa-ellipsis-vertical text-gray-300 cursor-pointer hover:text-gray-600"></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guruh qo'shish Drawer */}
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
                            <h3 className="text-[20px] font-[700] mb-1">Guruh qo'shish</h3>
                            <p className="text-[13px] text-gray-500">Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.</p>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                            ></i>
                        </div>
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[20px]">
                            {/* Guruh nomi */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Guruh nomi <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    placeholder="Frontend 2024"
                                    className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Kurs */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Kurs <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 appearance-none bg-white font-[500]">
                                        <option value="">Tanlang</option>
                                        <option value="Backend">Backend</option>
                                        <option value="Frontend">Frontend</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-[14px] top-[14px] text-gray-400 text-[12px]"></i>
                                </div>
                            </div>

                            {/* Xona */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Xona <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 appearance-none bg-white font-[500]">
                                        <option value="">Tanlang</option>
                                        <option value="Autodesk">Autodesk</option>
                                        <option value="Room 101">Room 101</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-[14px] top-[14px] text-gray-400 text-[12px]"></i>
                                </div>
                            </div>

                            {/* Dars kunlari */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[12px]">Dars kunlari <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 gap-[8px]">
                                    {["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"].map(day => (
                                        <label key={day} className="flex items-center gap-[8px] p-[10px] border border-gray-100 rounded-[10px] hover:bg-gray-50 cursor-pointer transition-colors">
                                            <Checkbox size="small" sx={{ p: 0 }} />
                                            <span className="text-[13px] font-[500] text-gray-700">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Dars vaqti */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Dars vaqti <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        defaultValue="09:00"
                                        className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 font-[500]"
                                    />
                                    <i className="fa-regular fa-clock absolute right-[14px] top-[12px] text-gray-400"></i>
                                </div>
                            </div>

                            {/* Boshlanish sanasi */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Boshlanish sanasi <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="dd/mm/yyyy"
                                        className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 font-[500]"
                                    />
                                    <i className="fa-regular fa-calendar absolute right-[14px] top-[12px] text-gray-400"></i>
                                </div>
                            </div>

                            {/* Tavsif */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Tavsif</label>
                                <textarea 
                                    placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"
                                    className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 min-h-[100px] resize-none font-[500]"
                                ></textarea>
                            </div>

                            {/* O'qituvchilar */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">O'qituvchilar</label>
                                {selectedTeacher && (
                                    <div className="flex items-center justify-between p-[12px] bg-purple-50 rounded-[12px] border border-purple-100 mb-3 group hover:bg-purple-100 transition-colors">
                                        <span className="text-[14px] font-[600] text-purple-700">{selectedTeacher}</span>
                                        <i className="fa-solid fa-xmark text-purple-300 cursor-pointer hover:text-red-500" onClick={() => setSelectedTeacher("")}></i>
                                    </div>
                                )}
                                <button 
                                    onClick={() => setIsTeacherModalOpen(true)}
                                    className="w-full py-[12px] border border-gray-200 rounded-[12px] flex items-center justify-center gap-[8px] text-purple-600 font-[600] hover:bg-purple-50 transition-colors"
                                >
                                    <i className="fa-solid fa-plus"></i> Qo'shish
                                </button>
                            </div>

                            {/* Talabalar */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Talabalar</label>
                                <div className="flex flex-wrap gap-[8px] mb-3">
                                    {selectedStudents.map(student => (
                                        <div key={student} className="flex items-center gap-2 bg-gray-50 px-[12px] py-[6px] rounded-full border border-gray-100 text-[13px] font-[500] text-gray-700 group hover:bg-purple-50 hover:border-purple-100 hover:text-purple-700 transition-all">
                                            {student}
                                            <i className="fa-solid fa-xmark text-gray-300 cursor-pointer group-hover:text-purple-400 hover:text-red-500" onClick={() => setSelectedStudents(selectedStudents.filter(s => s !== student))}></i>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setIsStudentModalOpen(true)}
                                    className="w-full py-[12px] border border-gray-200 rounded-[12px] flex items-center justify-center gap-[8px] text-purple-600 font-[600] hover:bg-purple-50 transition-colors"
                                >
                                    <i className="fa-solid fa-plus"></i> Qo'shish
                                </button>
                            </div>
                        </div>
                        <div className="p-[24px] border-t bg-white flex gap-[12px]">
                            <button className="flex-1 py-[12px] text-gray-700 font-[600] border border-gray-200 rounded-[12px] hover:bg-gray-50" onClick={() => setIsDrawerOpen(false)}>Bekor qilish</button>
                            <button className="flex-1 py-[12px] bg-purple-600 text-white font-[600] rounded-[12px] hover:bg-purple-700" onClick={() => setIsDrawerOpen(false)}>Saqlash</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Talaba qo'shish Modal */}
            {isStudentModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-[24px] relative">
                            <h3 className="text-[18px] font-[700] text-gray-800 mb-1">Talaba qo'shish</h3>
                            <p className="text-[13px] text-gray-500 mb-[20px]">Bitta yoki bir nechta talabani tanlang</p>
                            <i className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[18px] hover:text-red-500" onClick={() => setIsStudentModalOpen(false)}></i>

                            {/* Search and Action Bar as per image */}
                            <div className="flex items-center gap-[8px] mb-[20px]">
                                <div className="p-[10px] bg-gray-50 rounded-[12px] text-gray-400 border border-gray-100">
                                    <i className="fa-regular fa-calendar text-[18px]"></i>
                                </div>
                                <button className="bg-[#7c3aed] text-white px-[16px] py-[10px] rounded-[12px] font-[600] text-[14px] flex items-center gap-[8px] hover:bg-[#6d28d9] transition-colors shadow-sm">
                                    <i className="fa-solid fa-plus text-[12px]"></i> Qo'shish <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                </button>
                                <div className="flex-1 relative">
                                    <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-300"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Qidirish..."
                                        className="w-full pl-[36px] pr-[12px] py-[10px] bg-white border border-gray-100 rounded-[12px] outline-none text-[14px] focus:border-purple-300 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-[2px] max-h-[300px] overflow-y-auto mb-[24px] border border-gray-100 rounded-[16px]">
                                {studentsList.map(student => (
                                    <label key={student} className="flex items-center gap-[12px] p-[12px] hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                        <Checkbox 
                                            size="small" 
                                            checked={selectedStudents.includes(student)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedStudents([...selectedStudents, student])
                                                else setSelectedStudents(selectedStudents.filter(s => s !== student))
                                            }}
                                        />
                                        <span className="text-[14px] font-[500] text-gray-700">{student}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-[12px]">
                                <button className="px-[20px] py-[10px] text-gray-500 font-[600] hover:text-gray-800" onClick={() => setIsStudentModalOpen(false)}>Bekor qilish</button>
                                <button className="px-[30px] py-[10px] bg-purple-600 text-white font-[600] rounded-[12px] hover:bg-purple-700 transition-colors shadow-md" onClick={() => setIsStudentModalOpen(false)}>Saqlash</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* O'qituvchi qo'shish Modal (Limited to 1) */}
            {isTeacherModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-[24px] relative">
                            <h3 className="text-[18px] font-[700] text-gray-800 mb-1">O'qituvchi qo'shish</h3>
                            <p className="text-[13px] text-gray-500 mb-[20px]">Faqat bitta o'qituvchini tanlang</p>
                            <i className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[18px] hover:text-red-500" onClick={() => setIsTeacherModalOpen(false)}></i>

                            {/* Search and Action Bar as per image */}
                            <div className="flex items-center gap-[8px] mb-[20px]">
                                <div className="p-[10px] bg-gray-50 rounded-[12px] text-gray-400 border border-gray-100">
                                    <i className="fa-regular fa-calendar text-[18px]"></i>
                                </div>
                                <button className="bg-[#7c3aed] text-white px-[16px] py-[10px] rounded-[12px] font-[600] text-[14px] flex items-center gap-[8px] hover:bg-[#6d28d9] transition-colors shadow-sm">
                                    <i className="fa-solid fa-plus text-[12px]"></i> Qo'shish <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                </button>
                                <div className="flex-1 relative">
                                    <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-300"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Qidirish..."
                                        className="w-full pl-[36px] pr-[12px] py-[10px] bg-white border border-gray-100 rounded-[12px] outline-none text-[14px] focus:border-purple-300 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-[2px] max-h-[300px] overflow-y-auto mb-[24px] border border-gray-100 rounded-[16px]">
                                {teachersList.map(teacher => (
                                    <label key={teacher} className="flex items-center gap-[12px] p-[12px] hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                        <Radio 
                                            size="small" 
                                            checked={selectedTeacher === teacher}
                                            onChange={() => setSelectedTeacher(teacher)}
                                            sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#7c3aed' } }}
                                        />
                                        <span className="text-[14px] font-[500] text-gray-700">{teacher}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-[12px]">
                                <button className="px-[20px] py-[10px] text-gray-500 font-[600] hover:text-gray-800" onClick={() => setIsTeacherModalOpen(false)}>Bekor qilish</button>
                                <button className="px-[30px] py-[10px] bg-purple-600 text-white font-[600] rounded-[12px] hover:bg-purple-700 transition-colors shadow-md" onClick={() => setIsTeacherModalOpen(false)}>Saqlash</button>
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
