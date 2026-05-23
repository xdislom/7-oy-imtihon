import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Button, Checkbox } from "@mui/material"

export default function Teachers() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [teacherToDelete, setTeacherToDelete] = useState(null)
    const [toast, setToast] = useState(null)

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const [availableGroups, setAvailableGroups] = useState([])
    const [selectedGroups, setSelectedGroups] = useState([])
    const [tempSelected, setTempSelected] = useState([])
    const [teachersList, setTeachersList] = useState([])

    const [searchTerm, setSearchTerm] = useState('')
    const [groupSearchTerm, setGroupSearchTerm] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '+998',
        email: '',
        address: '',
        password: '',
    })

    const findTeachersArray = (obj) => {
        if (Array.isArray(obj)) return obj
        if (!obj || typeof obj !== 'object') return []
        if (Array.isArray(obj.data)) return obj.data
        if (obj.data && Array.isArray(obj.data.data)) return obj.data.data
        if (Array.isArray(obj.teachers)) return obj.teachers
        for (const key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) return obj[key]
        }
        return []
    }

    // API'dan o'qituvchilarni olib kelish
    const fetchTeachers = async () => {
        const token = localStorage.getItem("token") || ""
        try {
            const res = await fetch('https://najot-edu.softwareengineer.uz/api/v1/teachers', {
                headers: {
                    'Authorization': `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                const list = findTeachersArray(data)
                setTeachersList(list.map((t, index) => ({
                    id: t.id || t._id || index + 1,
                    name: t.full_name || t.name || "Noma'lum o'qituvchi",
                    groups: Array.isArray(t.groups) ? t.groups.map(g => typeof g === 'object' ? g.name : g) : [],
                    phone: t.phone || "Noma'lum",
                    birthDate: t.birth_date ? new Date(t.birth_date).toLocaleDateString('ru-RU') : "Noma'lum",
                    createdDate: t.created_at ? new Date(t.created_at).toLocaleDateString('ru-RU') : "Noma'lum"
                })))
            }
        } catch (error) {
            console.error("Xatolik:", error)
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
        fetchTeachers()
        fetchGroups()
    }, [])

    // O'qituvchini saqlash (POST)
    const handleSave = async () => {
        if (!formData.name || formData.phone === '+998') {
            alert("Iltimos, o'qituvchi ismi va telefon raqamini kiriting!")
            return
        }

        try {
            setIsLoading(true)
            const payload = {
                full_name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                password: formData.password,
                groups: selectedGroups.map(g => typeof g === 'object' ? g.id : g)
            }

            const token = localStorage.getItem("token") || ""
            const response = await fetch('https://najot-edu.softwareengineer.uz/api/v1/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                showToast("success", "O'qituvchi muvaffaqiyatli qo'shildi!")
                setIsDrawerOpen(false)
                setFormData({
                    name: '',
                    phone: '+998',
                    email: '',
                    address: '',
                    password: '',
                })
                setSelectedGroups([])
                setSelectedImage(null)
                fetchTeachers()
            } else {
                showToast("error", "Xatolik yuz berdi")
            }
        } catch (error) {
            console.error(error)
            showToast("error", "Server bilan bog'lanishda xatolik yuz berdi")
        } finally {
            setIsLoading(false)
        }
    }

    const confirmDelete = (id) => {
        setTeacherToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!teacherToDelete) return;
        const token = localStorage.getItem("token") || ""
        
        try {
            const response = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/teachers/${teacherToDelete}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                }
            })
            
            if (response.ok) {
                setTeachersList(prev => prev.filter(t => t.id !== teacherToDelete))
                showToast("success", "O'qituvchi muvaffaqiyatli o'chirildi")
            } else {
                const data = await response.json().catch(() => ({}))
                showToast("error", data.message || "O'chirishda xatolik yuz berdi")
            }
        } catch (error) {
            console.error("Error deleting teacher:", error)
            showToast("error", "Server bilan bog'lanishda xatolik")
        } finally {
            setIsDeleteModalOpen(false)
            setTeacherToDelete(null)
        }
    }

    // Modal ochilganda oldindan tanlangan guruhlarni tempSelected'ga yuklash
    const openGroupModal = () => {
        setTempSelected(selectedGroups)
        setIsModalOpen(true)
    }

    const handleAddGroups = () => {
        setSelectedGroups(tempSelected)
        setIsModalOpen(false)
    }

    const removeGroup = (groupId) => {
        setSelectedGroups(selectedGroups.filter(g => (g.id || g) !== groupId))
    }

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0])
        }
    }

    // O'qituvchilarni qidiruv bo'yicha filtrlash
    const filteredTeachers = useMemo(() => {
        return teachersList.filter(teacher =>
            teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.phone?.includes(searchTerm)
        )
    }, [teachersList, searchTerm])

    // Modal ichidagi guruhlarni qidiruv bo'yicha filtrlash
    const filteredGroups = useMemo(() => {
        return availableGroups.filter(group => {
            const name = typeof group === 'string' ? group : group.name
            return name?.toLowerCase().includes(groupSearchTerm.toLowerCase())
        })
    }, [availableGroups, groupSearchTerm])

    return (
        <div className="w-full relative bg-gray-50 min-h-screen">
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
                                sx={{ bgcolor: '#7c3aed', textTransform: 'none', borderRadius: '10px', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#6d28d9' } }}
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
                                    placeholder="Ism yoki telefon bo'yicha qidirish..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                {filteredTeachers.length > 0 ? (
                                    filteredTeachers.map((teacher) => (
                                        <tr key={teacher.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-[16px]"><Checkbox size="small" /></td>
                                            <td className="p-[16px]">
                                                <div className="flex items-center gap-[12px]">
                                                    <div className="w-[36px] h-[36px] rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-[700] text-[13px]">
                                                        {teacher.name ? teacher.name.charAt(0) : "U"}
                                                    </div>
                                                    <span className="font-[600] text-gray-800">{teacher.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-[16px]">
                                                <div className="flex gap-[6px] flex-wrap">
                                                    {(teacher.groups || []).map((group, i) => (
                                                        <span key={i} className="px-[10px] py-[3px] bg-gray-50 border border-gray-100 rounded-full text-[11px] font-[600] text-gray-500">
                                                            {group}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-[16px] font-[500] text-gray-600">{teacher.phone}</td>
                                            <td className="p-[16px] text-gray-500">{teacher.birthDate || "-"}</td>
                                            <td className="p-[16px] text-gray-500">{teacher.createdDate || "-"}</td>
                                            <td className="p-[16px]">
                                                <div className="flex items-center justify-center gap-[12px] text-gray-400">
                                                    <i className="fa-regular fa-eye cursor-pointer hover:text-purple-600"></i>
                                                    <i 
                                                        className="fa-regular fa-trash-can cursor-pointer hover:text-red-500"
                                                        onClick={() => confirmDelete(teacher.id)}
                                                    ></i>
                                                    <i className="fa-regular fa-pen-to-square cursor-pointer hover:text-purple-600"></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-400">Hech qanday o'qituvchi topilmadi.</td>
                                    </tr>
                                )}
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
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 font-[500]"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Mail</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Elektron pochtani kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">O'qituvchi FIO</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ma'lumotni kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Manzil</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Manzilni kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Parol</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Parolni kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Guruh</label>
                                <div className="flex flex-wrap gap-[8px] mb-3">
                                    {selectedGroups.map(group => {
                                        const groupId = group.id || group
                                        const groupName = group.name || group
                                        return (
                                        <div key={groupId} className="flex items-center gap-2 bg-purple-50 px-[12px] py-[6px] rounded-[10px] border border-purple-100 text-[13px] font-[600] text-purple-600 group hover:bg-purple-100 transition-colors">
                                            {groupName}
                                            <i className="fa-solid fa-xmark cursor-pointer text-purple-300 hover:text-red-500" onClick={() => removeGroup(groupId)}></i>
                                        </div>
                                        )
                                    })}
                                </div>
                                <button
                                    onClick={openGroupModal}
                                    className="w-full py-[14px] border border-gray-200 rounded-[12px] flex items-center justify-center gap-[8px] text-[#7c3aed] font-[700] hover:bg-purple-50 transition-colors border-dashed border-2"
                                >
                                    <i className="fa-solid fa-plus"></i> Guruhga biriktirish
                                </button>
                            </div>

                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Surati</label>
                                <label className="border-2 border-dashed border-gray-200 rounded-[20px] p-[30px] flex flex-col items-center justify-center text-center hover:border-purple-300 transition-colors cursor-pointer bg-white block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <div className="w-[48px] h-[48px] bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <i className="fa-solid fa-cloud-arrow-up text-gray-300 text-[20px]"></i>
                                    </div>
                                    <p className="text-[14px] font-[700] text-[#2d3748] mb-1">
                                        <span className="text-[#7c3aed]">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-[12px] text-gray-400 font-[500]">
                                        {selectedImage ? `Tanlandi: ${selectedImage.name}` : "JPG or PNG (max. 800x800px)"}
                                    </p>
                                </label>
                            </div>
                        </div>

                        <div className="p-[24px] border-t bg-white flex gap-[12px]">
                            <button className="flex-1 py-[12px] text-[#4a5568] font-[700] border border-gray-200 rounded-[12px] bg-[#edf2f7] hover:bg-gray-200 transition-colors" onClick={() => setIsDrawerOpen(false)}>Bekor qilish</button>
                            <button className="flex-1 py-[12px] bg-[#6366f1] text-white font-[700] rounded-[12px] hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50" onClick={handleSave} disabled={isLoading}>
                                {isLoading ? "Saqlanmoqda..." : "Saqlash"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guruhga biriktirish Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white w-full max-w-[400px] rounded-[24px] shadow-2xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-[24px] relative">
                            <h3 className="text-[18px] font-[700] text-gray-800 mb-1">Guruhga biriktirish</h3>
                            <p className="text-[13px] text-gray-500 mb-[20px]">Bir yoki bir nechta guruhni tanlang</p>
                            <i className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[18px] hover:text-red-500" onClick={() => setIsModalOpen(false)}></i>

                            <div className="relative mb-[16px]">
                                <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Guruh qidirish..."
                                    value={groupSearchTerm}
                                    onChange={(e) => setGroupSearchTerm(e.target.value)}
                                    className="w-full pl-[36px] pr-[12px] py-[10px] bg-gray-50/50 border border-gray-100 rounded-[12px] outline-none text-[14px] focus:border-purple-300"
                                />
                            </div>

                            <div className="space-y-[2px] max-h-[200px] overflow-y-auto mb-[24px] border border-gray-100 rounded-[16px]">
                                {filteredGroups.length > 0 ? (
                                    filteredGroups.map(group => {
                                        const groupId = group.id || group
                                        const groupName = group.name || group
                                        const isChecked = tempSelected.some(g => (g.id || g) === groupId)
                                        return (
                                        <label key={groupId} className="flex items-center gap-[12px] p-[12px] hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                            <Checkbox
                                                size="small"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    if (e.target.checked) setTempSelected([...tempSelected, group])
                                                    else setTempSelected(tempSelected.filter(g => (g.id || g) !== groupId))
                                                }}
                                            />
                                            <span className="text-[14px] font-[500] text-gray-700">{groupName}</span>
                                        </label>
                                        )
                                    })
                                ) : (
                                    <div className="p-4 text-center text-gray-400 text-[13px]">Guruh topilmadi</div>
                                )}
                            </div>

                            <div className="flex gap-[12px]">
                                <button className="flex-1 py-[10px] text-gray-700 font-[600] border border-gray-200 rounded-[12px] hover:bg-gray-50" onClick={() => setIsModalOpen(false)}>Bekor qilish</button>
                                <button className="flex-1 py-[10px] bg-[#c3baff] text-[#7c3aed] font-[700] rounded-[12px] hover:bg-[#b0a5ff] transition-colors" onClick={handleAddGroups}>Qo'shish</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-[380px] rounded-[16px] shadow-2xl p-[24px] animate-fade-in relative">
                        <h3 className="text-[20px] font-[700] text-gray-800 mb-2">O'qituvchini o'chirish</h3>
                        <p className="text-[15px] text-gray-600 mb-[32px]">Rostdan ham o'chirishni xohlaysizmi?</p>
                        
                        <div className="flex justify-end gap-[12px]">
                            <button 
                                className="px-[20px] py-[10px] text-[15px] font-[600] text-gray-500 hover:bg-gray-50 rounded-[10px] transition-colors"
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setTeacherToDelete(null)
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
                        toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                >
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-[18px]`}></i>
                    {toast.message}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes toast-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-toast-up {
                    animation: toast-up 0.3s ease-out;
                }
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