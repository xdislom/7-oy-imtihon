import React, { useState, useEffect } from 'react'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Button, Checkbox } from "@mui/material"

const colors = [
    "bg-orange-100 text-orange-600",
    "bg-purple-100 text-purple-600",
    "bg-blue-100 text-blue-600",
    "bg-indigo-100 text-indigo-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-teal-100 text-teal-600"
]

export default function Students() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState(null)
    const [selectedGroups, setSelectedGroups] = useState([])
    const [tempSelected, setTempSelected] = useState([])
    const [availableGroups, setAvailableGroups] = useState([])
    const [groupSearchTerm, setGroupSearchTerm] = useState('')
    const [students, setStudents] = useState([])
    const [phone, setPhone] = useState("+998")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [address, setAddress] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [toast, setToast] = useState(null) // { type: 'success' | 'error', message: string }

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const fetchStudents = async () => {
        const token = localStorage.getItem("token") || ""
        
        const findStudentsArray = (obj) => {
            if (Array.isArray(obj)) return obj;
            if (!obj || typeof obj !== 'object') return [];
            
            if (Array.isArray(obj.data)) return obj.data;
            if (obj.data && Array.isArray(obj.data.data)) return obj.data.data;
            if (obj.data && Array.isArray(obj.data.students)) return obj.data.students;
            if (Array.isArray(obj.students)) return obj.students;
            if (Array.isArray(obj.items)) return obj.items;
            if (Array.isArray(obj.rows)) return obj.rows;
            if (Array.isArray(obj.list)) return obj.list;

            for (const key of Object.keys(obj)) {
                if (Array.isArray(obj[key])) {
                    return obj[key];
                }
                if (obj[key] && typeof obj[key] === 'object') {
                    const nested = findStudentsArray(obj[key]);
                    if (nested.length > 0) return nested;
                }
            }
            return [];
        }

        try {
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/students", {
                headers: {
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                console.log("Fetched students list raw:", data)
                const list = findStudentsArray(data)
                console.log("Extracted students array:", list)
                const mapped = list.map((s, index) => ({
                    id: s.id || s._id || index + 1,
                    name: s.full_name || s.name || "Noma'lum student",
                    groups: Array.isArray(s.groups) ? s.groups.map(g => typeof g === 'object' ? g.name : g) : [],
                    phone: s.phone || "Noma'lum",
                    email: s.email || "Noma'lum",
                    birthDate: s.birth_date ? new Date(s.birth_date).toLocaleDateString('ru-RU') : "Noma'lum",
                    address: s.address || "Noma'lum",
                    createdDate: s.created_at ? new Date(s.created_at).toLocaleDateString('ru-RU') : "Noma'lum",
                    initial: (s.full_name || s.name || "S").charAt(0).toUpperCase(),
                    color: colors[index % colors.length]
                }))
                setStudents(mapped)
            }
        } catch (error) {
            console.error("Error fetching students:", error)
        }
    }

    const fetchGroups = async () => {
        const token = localStorage.getItem("token") || ""
        try {
            const res = await fetch('https://najot-edu.softwareengineer.uz/api/v1/groups/all', {
                headers: { 'Authorization': `Bearer ${token.replace(/^Bearer\s+/i, '')}` }
            })
            if (res.ok) {
                const data = await res.json()
                let list = []
                if (Array.isArray(data)) list = data
                else if (Array.isArray(data.data)) list = data.data
                else if (data.data && Array.isArray(data.data.data)) list = data.data.data
                setAvailableGroups(list)
            }
        } catch (error) {
            console.error("Guruhlarni yuklashda xatolik:", error)
        }
    }

    useEffect(() => {
        fetchStudents()
        fetchGroups()
    }, [])

    const handleSave = async () => {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token") || ""

        const payload = {
            phone,
            email,
            full_name: name,
            birth_date: birthDate || null,
            address,
            password,
            groups: selectedGroups.map(g => typeof g === 'object' ? g.id : g)
        }

        try {
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            console.log("Save student response:", data)

            if (response.ok) {
                // Yangi talabani darhol listga qo'shish
                const newStudent = data.data || data
                const idx = students.length
                setStudents(prev => [
                    ...prev,
                    {
                        id: newStudent.id || newStudent._id || Date.now(),
                        name: newStudent.full_name || newStudent.name || name,
                        groups: Array.isArray(newStudent.groups)
                            ? newStudent.groups.map(g => typeof g === 'object' ? g.name : g)
                            : selectedGroups.map(g => typeof g === 'object' ? g.name : g),
                        phone: newStudent.phone || phone,
                        email: newStudent.email || email,
                        birthDate: birthDate
                            ? new Date(birthDate).toLocaleDateString('ru-RU')
                            : "Noma'lum",
                        address: newStudent.address || address || "Noma'lum",
                        createdDate: new Date().toLocaleDateString('ru-RU'),
                        initial: (name || "S").charAt(0).toUpperCase(),
                        color: colors[idx % colors.length]
                    }
                ])
                // Formani tozalash
                setIsDrawerOpen(false)
                setPhone("+998")
                setEmail("")
                setName("")
                setBirthDate("")
                setAddress("")
                setPassword("")
                setSelectedGroups([])
                showToast("success", `"${name}" muvaffaqiyatli qo'shildi! ✓`)
            } else {
                const errMsg = data.message || "Xatolik yuz berdi!"
                setError(errMsg)
                showToast("error", errMsg)
            }
        } catch (error) {
            console.error("Error saving student:", error)
            const errMsg = "Server bilan bog'lanishda xatolik!"
            setError(errMsg)
            showToast("error", errMsg)
        } finally {
            setLoading(false)
        }
    }


    const confirmDelete = (id) => {
        setStudentToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!studentToDelete) return;
        const token = localStorage.getItem("token") || ""
        
        try {
            const response = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/students/${studentToDelete}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                }
            })
            
            if (response.ok) {
                setStudents(prev => prev.filter(s => s.id !== studentToDelete))
                showToast("success", "Talaba muvaffaqiyatli o'chirildi")
            } else {
                const data = await response.json().catch(() => ({}))
                showToast("error", data.message || "O'chirishda xatolik yuz berdi")
            }
        } catch (error) {
            console.error("Error deleting student:", error)
            showToast("error", "Server bilan bog'lanishda xatolik")
        } finally {
            setIsDeleteModalOpen(false)
            setStudentToDelete(null)
        }
    }

    const handleAddGroups = () => {
        const combined = [...selectedGroups, ...tempSelected]
        const unique = []
        const ids = new Set()
        for (const g of combined) {
            const id = g.id || g
            if (!ids.has(id)) {
                ids.add(id)
                unique.push(g)
            }
        }
        setSelectedGroups(unique)
        setIsModalOpen(false)
        setTempSelected([])
    }

    const removeGroup = (groupId) => {
        setSelectedGroups(selectedGroups.filter(g => (g.id || g) !== groupId))
    }

    const toggleTempGroup = (group) => {
        const groupId = group.id || group
        if (tempSelected.some(g => (g.id || g) === groupId)) {
            setTempSelected(tempSelected.filter(g => (g.id || g) !== groupId))
        } else {
            setTempSelected([...tempSelected, group])
        }
    }

    return (
        <div className="max-w-[1600px] m-auto bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col">
                    {/* Header Area (Gray Top) */}
                    <div className="px-[20px] md:px-[40px] bg-gray-50 pb-[20px]">
                        <Header onMenuClick={() => setIsSidebarOpen(true)} />
                        
                        <div className="flex justify-between items-start mt-[20px] mb-[24px]">
                            <div className="max-w-[70%]">
                                <h2 className="text-[28px] font-[700] mb-[4px]">Talabalar</h2>
                                <p className="text-gray-500 text-[14px] leading-relaxed">
                                    Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz. 
                                    Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                                </p>
                            </div>
                            <Button 
                                variant="contained" 
                                onClick={() => setIsDrawerOpen(true)}
                                sx={{ 
                                    bgcolor: '#7c3aed', 
                                    textTransform: 'none', 
                                    borderRadius: '10px', 
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.2
                                }}
                            >
                                + Talaba qo'shish
                            </Button>
                        </div>
                    </div>

                    {/* Content Area (White Bottom) */}
                    <div className="flex-1 bg-white px-[20px] md:px-[40px] pt-[30px] pb-[40px]">
                        
                        {/* Main Bordered Container */}
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden p-[20px]">
                            
                            {/* Filter Bar */}
                            <div className="flex justify-between items-center mb-[20px]">
                                <div className="relative flex-1 max-w-[300px]">
                                    <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-300"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Search"
                                        className="w-full pl-[36px] pr-[12px] py-[8px] bg-gray-50/50 border border-gray-100 rounded-[10px] outline-none text-[14px] focus:border-purple-300 transition-colors"
                                    />
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <Button variant="outlined" sx={{ color: '#374151', borderColor: '#e5e7eb', textTransform: 'none', borderRadius: '8px', px: 2 }}>
                                        <i className="fa-solid fa-sliders mr-2"></i> Filters
                                    </Button>
                                    <Button variant="outlined" sx={{ color: '#374151', borderColor: '#e5e7eb', textTransform: 'none', borderRadius: '8px', px: 2 }}>
                                        Arxiv
                                    </Button>
                                </div>
                            </div>

                            {/* Students Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-gray-400 text-[13px] font-[600] border-b border-gray-50">
                                            <th className="py-[16px] px-[12px] w-[40px]"><Checkbox size="small" /></th>
                                            <th className="py-[16px] px-[12px]">Nomi &darr;</th>
                                            <th className="py-[16px] px-[12px] text-center">Guruh</th>
                                            <th className="py-[16px] px-[12px]">Telefon raqamlari</th>
                                            <th className="py-[16px] px-[12px]">Email</th>
                                            <th className="py-[16px] px-[12px]">Tug'ilgan sanasi</th>
                                            <th className="py-[16px] px-[12px]">Manzil</th>
                                            <th className="py-[16px] px-[12px]">Yaratilgan sana</th>
                                            <th className="py-[16px] px-[12px] text-right pr-[24px]">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[14px]">
                                        {students.map((student) => (
                                            <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                                <td className="py-[16px] px-[12px]"><Checkbox size="small" /></td>
                                                <td className="py-[16px] px-[12px]">
                                                    <div className="flex items-center gap-[10px]">
                                                        <div className={`w-[32px] h-[32px] rounded-full ${student.color} flex items-center justify-center font-[600] text-[12px]`}>
                                                            {student.initial}
                                                        </div>
                                                        <span className="font-[600] text-gray-800">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-[16px] px-[12px]">
                                                    <div className="flex flex-wrap justify-center gap-[4px] max-w-[200px] mx-auto">
                                                        {student.groups.map(group => (
                                                            <span key={group} className="px-[6px] py-[1px] bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-[4px] text-[10px] font-[500]">
                                                                {group}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-[16px] px-[12px] text-gray-600 font-[500]">{student.phone}</td>
                                                <td className="py-[16px] px-[12px] text-gray-500">{student.email}</td>
                                                <td className="py-[16px] px-[12px] text-gray-500">{student.birthDate}</td>
                                                <td className="py-[16px] px-[12px] text-gray-500">{student.address}</td>
                                                <td className="py-[16px] px-[12px] text-gray-500">{student.createdDate}</td>
                                                <td className="py-[16px] px-[12px]">
                                                    <div className="flex items-center justify-end gap-[12px] text-gray-400">
                                                        <i className="fa-regular fa-eye cursor-pointer hover:text-purple-600"></i>
                                                        <i 
                                                            className="fa-regular fa-trash-can cursor-pointer hover:text-red-500"
                                                            onClick={() => confirmDelete(student.id)}
                                                        ></i>
                                                        <i className="fa-regular fa-pen-to-square cursor-pointer hover:text-purple-600"></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-[30px] flex items-center justify-between">
                                <Button variant="outlined" sx={{ textTransform: 'none', color: '#374151', borderColor: '#e5e7eb', borderRadius: '8px' }}>
                                    &larr; Previous
                                </Button>
                                <div className="flex items-center gap-[8px]">
                                    <button className="w-[32px] h-[32px] rounded-full bg-gray-100 text-gray-700 font-[600] text-[14px]">1</button>
                                    <button className="w-[32px] h-[32px] rounded-full hover:bg-gray-50 text-gray-500 text-[14px]">2</button>
                                    <button className="w-[32px] h-[32px] rounded-full hover:bg-gray-50 text-gray-500 text-[14px]">3</button>
                                    <span className="text-gray-400">...</span>
                                    <button className="w-[32px] h-[32px] rounded-full hover:bg-gray-50 text-gray-500 text-[14px]">8</button>
                                    <button className="w-[32px] h-[32px] rounded-full hover:bg-gray-50 text-gray-500 text-[14px]">9</button>
                                    <button className="w-[32px] h-[32px] rounded-full hover:bg-gray-50 text-gray-500 text-[14px]">10</button>
                                </div>
                                <Button variant="outlined" sx={{ textTransform: 'none', color: '#374151', borderColor: '#e5e7eb', borderRadius: '8px' }}>
                                    Next &rarr;
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Talaba qo'shish Drawer */}
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
                            <h3 className="text-[20px] font-[700] mb-1">Talaba qo'shish</h3>
                            <p className="text-[13px] text-gray-500">Bu yerda siz yangi Talaba qo'shishingiz mumkin.</p>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => setIsDrawerOpen(false)}
                            ></i>
                        </div>
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[20px]">
                            {/* Telefon raqam */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Telefon raqam</label>
                                <input 
                                    type="text" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 font-[500]"
                                />
                            </div>

                            {/* Mail */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Mail</label>
                                <input 
                                    type="email" 
                                    placeholder="Elektron pochtani kiriting"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Talaba FIO */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Talaba FIO</label>
                                <input 
                                    type="text" 
                                    placeholder="Ma'lumotni kiriting"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Tug'ilgan sanasi */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Tug'ilgan sanasi</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                    />
                                    <i className="fa-regular fa-calendar absolute right-[14px] top-[12px] text-gray-400"></i>
                                </div>
                            </div>

                            {/* Manzil */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Manzil</label>
                                <input 
                                    type="text" 
                                    placeholder="Manzilni kiriting"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Parol */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Parol</label>
                                <input 
                                    type="password" 
                                    placeholder="Parolni kiriting"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Guruh */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Guruh</label>
                                {selectedGroups.length > 0 && (
                                    <div className="flex flex-wrap gap-[8px] mb-[12px]">
                                        {selectedGroups.map(group => {
                                            const groupId = group.id || group
                                            const groupName = group.name || group
                                            return (
                                            <div key={groupId} className="flex items-center gap-[8px] bg-purple-50 text-purple-600 px-[12px] py-[6px] rounded-[10px] border border-purple-100 group hover:bg-purple-100 transition-colors">
                                                <span className="text-[13px] font-[600]">{groupName}</span>
                                                <i 
                                                    className="fa-solid fa-xmark cursor-pointer text-[12px] opacity-40 group-hover:opacity-100 hover:text-red-500"
                                                    onClick={() => removeGroup(groupId)}
                                                ></i>
                                            </div>
                                            )
                                        })}
                                    </div>
                                )}
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-[12px] border border-gray-200 rounded-[12px] flex items-center justify-center gap-[8px] text-purple-600 font-[600] hover:bg-purple-50 transition-colors"
                                >
                                    <i className="fa-solid fa-plus"></i> Guruh qo'shish
                                </button>
                            </div>

                            {/* Surati */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Surati</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-[16px] p-[24px] flex flex-col items-center justify-center text-center hover:border-purple-300 transition-colors cursor-pointer">
                                    <div className="w-[40px] h-[40px] bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-arrow-up text-gray-400"></i>
                                    </div>
                                    <p className="text-[14px] font-[600] mb-1">
                                        <span className="text-purple-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-[12px] text-gray-400">JPG or PNG (max. 2 MB)</p>
                                </div>
                            </div>
                        </div>
                        {error && (
                            <div className="px-[24px] py-[8px] text-red-500 text-[13px] font-[500]">
                                {error}
                            </div>
                        )}
                        <div className="p-[24px] border-t bg-white flex gap-[12px]">
                            <button className="flex-1 py-[12px] text-gray-700 font-[600] border border-gray-200 rounded-[12px] hover:bg-gray-50" onClick={() => setIsDrawerOpen(false)}>Bekor qilish</button>
                            <button 
                                className={`flex-1 py-[12px] font-[600] rounded-[12px] ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`} 
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guruhga biriktirish Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-full max-w-[400px] rounded-[20px] shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-[24px] relative">
                            <h3 className="text-[18px] font-[700] text-gray-800 mb-1">Guruhga biriktirish</h3>
                            <p className="text-[13px] text-gray-500 mb-[20px]">Bir yoki bir nechta guruhni tanlang</p>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[18px] hover:text-red-500"
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setTempSelected([])
                                }}
                            ></i>

                            <div className="relative mb-[16px]">
                                <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-300"></i>
                                <input 
                                    type="text" 
                                    placeholder="Guruh qidirish..."
                                    value={groupSearchTerm}
                                    onChange={(e) => setGroupSearchTerm(e.target.value)}
                                    className="w-full pl-[36px] pr-[12px] py-[10px] bg-gray-50/50 border border-gray-100 rounded-[12px] outline-none text-[14px] focus:border-purple-300"
                                />
                            </div>

                            <div className="space-y-[8px] max-h-[200px] overflow-y-auto mb-[24px]">
                                {availableGroups
                                    .filter(group => {
                                        const name = typeof group === 'string' ? group : group.name
                                        return name?.toLowerCase().includes(groupSearchTerm.toLowerCase())
                                    })
                                    .map(group => {
                                        const groupId = group.id || group
                                        const groupName = group.name || group
                                        const isChecked = tempSelected.some(g => (g.id || g) === groupId)
                                        return (
                                        <label key={groupId} className="flex items-center gap-[12px] p-[12px] border border-gray-100 rounded-[12px] hover:bg-gray-50 cursor-pointer group transition-colors">
                                            <Checkbox 
                                                size="small" 
                                                checked={isChecked}
                                                onChange={() => toggleTempGroup(group)}
                                            />
                                            <span className="text-[14px] font-[500] text-gray-700">{groupName}</span>
                                        </label>
                                        )
                                })}
                            </div>

                            <div className="flex gap-[12px]">
                                <button 
                                    className="flex-1 py-[10px] text-gray-700 font-[600] border border-gray-200 rounded-[12px] hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setTempSelected([])
                                    }}
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    className="flex-1 py-[10px] bg-purple-600 text-white font-[600] rounded-[12px] hover:bg-purple-700 transition-colors"
                                    onClick={handleAddGroups}
                                >
                                    Qo'shish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-[380px] rounded-[16px] shadow-2xl p-[24px] animate-fade-in relative">
                        <h3 className="text-[20px] font-[700] text-gray-800 mb-2">Talabani o'chirish</h3>
                        <p className="text-[15px] text-gray-600 mb-[32px]">Rostdan ham o'chirishni xohlaysizmi?</p>
                        
                        <div className="flex justify-end gap-[12px]">
                            <button 
                                className="px-[20px] py-[10px] text-[15px] font-[600] text-gray-500 hover:bg-gray-50 rounded-[10px] transition-colors"
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setStudentToDelete(null)
                                }}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                className="px-[24px] py-[10px] text-[15px] font-[600] bg-[#e11d48] text-white rounded-[10px] hover:bg-[#be123c] transition-colors"
                                onClick={handleDelete}
                            >
                                Ha
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed bottom-[32px] right-[32px] z-[999] flex items-center gap-[12px] px-[20px] py-[14px] rounded-[14px] shadow-2xl text-white text-[14px] font-[600] animate-toast-up ${
                        toast.type === 'success'
                            ? 'bg-emerald-500'
                            : 'bg-red-500'
                    }`}
                >
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-[18px]`}></i>
                    {toast.message}
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
                @keyframes toast-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-toast-up {
                    animation: toast-up 0.3s ease-out;
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
