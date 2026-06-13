"use client";

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { Button } from "@mui/material"

const tabs = [
    "Kurslar", "Xonalar", "Hodimlar"
]

const cardColors = [
    "bg-white",
    "bg-white",
    "bg-yellow-50 border-yellow-200",
    "bg-green-50 border-green-200",
    "bg-blue-50 border-blue-200",
    "bg-pink-50 border-pink-200",
]





function XonalarTab() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [roomsList, setRoomsList] = useState([])
    const [showRoomArchive, setShowRoomArchive] = useState(false)
    const [archivedRooms, setArchivedRooms] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [roomToDelete, setRoomToDelete] = useState(null)
    const [toast, setToast] = useState(null)
    const [roomForm, setRoomForm] = useState({ name: "", capacity: "" })
    const [roomSaving, setRoomSaving] = useState(false)
    const [roomFormError, setRoomFormError] = useState("")
    const [editingRoom, setEditingRoom] = useState(null)

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const findRoomsArray = (obj) => {
        if (Array.isArray(obj)) return obj
        if (!obj || typeof obj !== 'object') return []
        if (Array.isArray(obj.data)) return obj.data
        if (obj.data && Array.isArray(obj.data.data)) return obj.data.data
        if (Array.isArray(obj.rooms)) return obj.rooms
        for (const key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) return obj[key]
        }
        return []
    }

    const fetchRooms = async () => {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token")
        
        try {
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/rooms", {
                headers: token ? { "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}` } : {}
            })
            
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || "Xonalarni yuklashda xatolik yuz berdi")
            
            const list = findRoomsArray(data)
            setRoomsList(list.map((room, index) => ({
                id: room.id || room._id || index + 1,
                name: room.name || room.title || `Xona ${index + 1}`,
                capacity: room.capacity || room.max_student || room.maxStudent || 0
            })))
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchArchivedRooms = async () => {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token")
        
        try {
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/rooms/arxive", {
                headers: token ? { "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}` } : {}
            })
            
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || "Arxiv xonalarni yuklashda xatolik yuz berdi")
            
            const list = findRoomsArray(data)
            setArchivedRooms(list.map((room, index) => ({
                id: room.id || room._id || index + 1,
                name: room.name || room.title || `Xona ${index + 1}`,
                capacity: room.capacity || room.max_student || room.maxStudent || 0
            })))
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [])

    const confirmDelete = (id) => {
        setRoomToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const resetRoomForm = () => {
        setRoomForm({ name: "", capacity: "" })
        setEditingRoom(null)
        setRoomFormError("")
    }

    const openEditRoom = (room) => {
        setEditingRoom(room)
        setRoomForm({
            name: room.name || "",
            capacity: String(room.capacity || "")
        })
        setIsDrawerOpen(true)
    }

    const handleSaveRoom = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setRoomFormError("Avval tizimga kiring")
            return
        }

        const isUpdate = !!editingRoom

        if (!isUpdate && (!roomForm.name.trim() || !roomForm.capacity)) {
            setRoomFormError("Xona nomi va sig'imini kiriting")
            return
        }

        if (isUpdate && !roomForm.name.trim() && !roomForm.capacity) {
            setRoomFormError("Kamida bitta maydonni o'zgartiring")
            return
        }

        setRoomSaving(true)
        setRoomFormError("")

        try {
            const payload = isUpdate
                ? {
                    ...(roomForm.name.trim() ? { name: roomForm.name.trim() } : {}),
                    ...(roomForm.capacity ? { capacity: Number(roomForm.capacity) } : {})
                }
                : {
                    name: roomForm.name.trim(),
                    capacity: Number(roomForm.capacity)
                }

            const response = await fetch(
                isUpdate
                    ? `https://najot-edu.softwareengineer.uz/api/v1/rooms/${editingRoom.id}`
                    : "https://najot-edu.softwareengineer.uz/api/v1/rooms",
                {
                    method: isUpdate ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                    },
                    body: JSON.stringify(payload)
                }
            )

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.message || (isUpdate ? "Xonani yangilashda xatolik yuz berdi" : "Xona qo'shishda xatolik yuz berdi"))
            }

            if (isUpdate) {
                setRoomsList(prev => prev.map(item =>
                    item.id === editingRoom.id
                        ? { ...item, ...payload }
                        : item
                ))
                showToast("success", "Xona muvaffaqiyatli yangilandi")
            } else {
                const createdRoom = data.data || data
                setRoomsList(prev => [
                    {
                        id: createdRoom.id || createdRoom._id || Date.now(),
                        name: createdRoom.name || roomForm.name.trim(),
                        capacity: createdRoom.capacity || Number(roomForm.capacity)
                    },
                    ...prev
                ])
                showToast("success", "Xona muvaffaqiyatli qo'shildi")
            }

            resetRoomForm()
            setIsDrawerOpen(false)
            await fetchRooms()
        } catch (err) {
            setRoomFormError(err.message || (isUpdate ? "Xonani yangilashda xatolik yuz berdi" : "Xona qo'shishda xatolik yuz berdi"))
        } finally {
            setRoomSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!roomToDelete) return;
        const token = localStorage.getItem("token")
        
        try {
            const response = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/rooms/${roomToDelete}`, {
                method: "DELETE",
                headers: token ? { "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}` } : {}
            })
            
            if (response.ok) {
                setRoomsList(prev => prev.filter(r => r.id !== roomToDelete))
                showToast("success", "Xona muvaffaqiyatli o'chirildi")
            } else {
                const data = await response.json().catch(() => ({}))
                showToast("error", data.message || "O'chirishda xatolik yuz berdi")
            }
        } catch (error) {
            console.error("Error deleting room:", error)
            showToast("error", "Server bilan bog'lanishda xatolik")
        } finally {
            setIsDeleteModalOpen(false)
            setRoomToDelete(null)
        }
    }

    return (
        <div className="relative">
            <div className="flex justify-between items-start mb-[20px]">
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-[22px] font-[600]">Xonalar</h3>
                        <button onClick={showRoomArchive ? fetchArchivedRooms : fetchRooms} className="text-gray-400 hover:text-purple-600" disabled={loading}>
                            <i className={`fa-solid fa-rotate-right cursor-pointer ${loading ? 'animate-spin' : ''}`}></i>
                        </button>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                        <button 
                            onClick={() => {
                                setShowRoomArchive(false);
                                fetchRooms();
                            }}
                            className={`text-[15px] font-[600] transition-colors ${!showRoomArchive ? 'text-[#3366FF]' : 'text-gray-500 hover:text-[#3366FF]'}`}
                        >
                            Xonalar
                        </button>
                        <button 
                            onClick={() => {
                                setShowRoomArchive(true);
                                fetchArchivedRooms();
                            }}
                            className={`text-[15px] font-[600] flex items-center gap-2 transition-colors ${showRoomArchive ? 'text-[#3366FF]' : 'text-gray-500 hover:text-[#3366FF]'}`}
                        >
                            <i className="fa-solid fa-box-archive text-[14px]"></i> Arxiv
                        </button>
                    </div>
                </div>
                <Button
                    variant="contained"
                    onClick={() => setIsDrawerOpen(true)}
                    sx={{ bgcolor: '#7c3aed', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    + Xonani qo'shish
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500 font-[600]">Xonalar yuklanmoqda...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500 font-[600]">{error}</div>
            ) : (showRoomArchive ? archivedRooms : roomsList).length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-[600]">{showRoomArchive ? "Arxivlangan xonalar topilmadi" : "Xonalar topilmadi"}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                    {(showRoomArchive ? archivedRooms : roomsList).map(room => (
                        <div key={room.id} className="bg-white rounded-[12px] p-[16px] border border-gray-100 flex justify-between items-center shadow-sm">
                            <div>
                                <p className="text-[15px] font-[600] text-gray-800">{room.name}</p>
                                <p className="text-[13px] text-gray-500">Sig'imi: {room.capacity}</p>
                            </div>
                            <div className="flex gap-[8px]">
                                {!showRoomArchive && (
                                    <>
                                        <i 
                                            className="fa-regular fa-trash-can text-gray-400 hover:text-red-500 cursor-pointer"
                                            onClick={() => confirmDelete(room.id)}
                                        ></i>
                                        <i
                                            className="fa-regular fa-pen-to-square text-gray-400 hover:text-purple-600 cursor-pointer"
                                            onClick={() => openEditRoom(room)}
                                        ></i>
                                    </>
                                )}
                                {showRoomArchive && (
                                    <span className="text-[11px] font-[700] text-gray-400">ARXIV</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-[380px] rounded-[16px] shadow-2xl p-[24px] animate-fade-in relative">
                        <h3 className="text-[20px] font-[700] text-gray-800 mb-2">Xonani o'chirish</h3>
                        <p className="text-[15px] text-gray-600 mb-[32px]">Rostdan ham o'chirishni xohlaysizmi?</p>
                        
                        <div className="flex justify-end gap-[12px]">
                            <button 
                                className="px-[20px] py-[10px] text-[15px] font-[600] text-gray-500 hover:bg-gray-50 rounded-[10px] transition-colors"
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setRoomToDelete(null)
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

            {isDrawerOpen && (
                <div className="fixed inset-0 bg-black/20 z-[200] flex justify-end" onClick={() => { setIsDrawerOpen(false); resetRoomForm(); }}>
                    <div className="w-[450px] h-full bg-white shadow-2xl flex flex-col animate-slide-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-[24px] border-b relative">
                            <h3 className="text-[20px] font-[600] mb-1">{editingRoom ? "Xona yangilash" : "Xona qo'shish"}</h3>
                            <i className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500" onClick={() => { setIsDrawerOpen(false); resetRoomForm(); }}></i>
                        </div>
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[24px]">
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Xona nomi</label>
                                <input
                                    type="text"
                                    value={roomForm.name}
                                    onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Xona nomini kiriting"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-[500] text-gray-700 mb-[8px]">Sig'imi (kishi)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={roomForm.capacity}
                                    onChange={(e) => setRoomForm(prev => ({ ...prev, capacity: e.target.value }))}
                                    placeholder="Masalan: 15"
                                    className="w-full px-[12px] py-[10px] border border-gray-200 rounded-[10px] outline-none focus:border-purple-500"
                                />
                            </div>
                            {roomFormError && <p className="text-[13px] text-red-500">{roomFormError}</p>}
                        </div>
                        <div className="p-[24px] border-t bg-gray-50 flex gap-[12px]">
                            <button className="flex-1 py-[10px] text-gray-600 font-[600] border border-gray-200 rounded-[10px] bg-white hover:bg-gray-100" onClick={() => { setIsDrawerOpen(false); resetRoomForm(); }}>Bekor qilish</button>
                            <button
                                className="flex-1 py-[10px] bg-purple-600 text-white font-[600] rounded-[10px] hover:bg-purple-700 disabled:bg-purple-300"
                                onClick={handleSaveRoom}
                                disabled={roomSaving}
                            >
                                {roomSaving ? "Saqlanmoqda..." : (editingRoom ? "Yangilash" : "Saqlash")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function KurslarTab() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [coursesList, setCoursesList] = useState([])
    const [showArchive, setShowArchive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)
    const [toast, setToast] = useState(null)
    const [courseForm, setCourseForm] = useState({
        name: "",
        duration_hours: "",
        duration_month: "",
        price: "",
        description: "",
    })
    const [courseSaving, setCourseSaving] = useState(false)
    const [courseFormError, setCourseFormError] = useState("")
    const [editingCourse, setEditingCourse] = useState(null)

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const findCoursesArray = (obj) => {
        if (Array.isArray(obj)) return obj
        if (!obj || typeof obj !== 'object') return []
        if (Array.isArray(obj.data)) return obj.data
        if (obj.data && Array.isArray(obj.data.data)) return obj.data.data
        if (Array.isArray(obj.courses)) return obj.courses
        for (const key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) return obj[key]
        }
        return []
    }

    const fetchCourses = async (isArchive = showArchive) => {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token")
        
        try {
            const url = isArchive 
                ? "https://najot-edu.softwareengineer.uz/api/v1/courses/archive" 
                : "https://najot-edu.softwareengineer.uz/api/v1/courses"
            const response = await fetch(url, {
                headers: token ? { "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}` } : {}
            })
            
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || "Kurslarni yuklashda xatolik yuz berdi")
            
            const list = findCoursesArray(data)
            setCoursesList(list.map((course, index) => ({
                id: course.id || course._id || index + 1,
                title: course.name || course.title || `Kurs ${index + 1}`,
                desc: course.description || course.desc || "Ma'lumot mavjud emas",
                duration: course.duration_hours || course.durationHours || course.duration || "Noma'lum",
                period: course.duration_month || course.durationMonth || course.month ? `${course.duration_month || course.durationMonth || course.month} oy` : "Noma'lum",
                price: course.price ? `${Number(course.price).toLocaleString()} so'm` : "Noma'lum",
                priceValue: course.price || 0,
                durationHours: course.duration_hours || course.durationHours || "",
                durationMonth: course.duration_month || course.durationMonth || "",
                description: course.description || course.desc || "",
                color: cardColors[index % cardColors.length]
            })))
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const resetCourseForm = () => {
        setCourseForm({ name: "", duration_hours: "", duration_month: "", price: "", description: "" })
        setEditingCourse(null)
        setCourseFormError("")
    }

    const openEditCourse = (course) => {
        setEditingCourse(course)
        setCourseForm({
            name: course.title || "",
            duration_hours: String(course.durationHours || course.duration || ""),
            duration_month: String(course.durationMonth || ""),
            price: String(course.priceValue || ""),
            description: course.description || "",
        })
        setIsDrawerOpen(true)
    }

    const handleSaveCourse = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setCourseFormError("Avval tizimga kiring")
            return
        }

        const isUpdate = !!editingCourse

        if (!isUpdate) {
            if (!courseForm.name.trim() || !courseForm.duration_hours || !courseForm.duration_month || !courseForm.price || !courseForm.description.trim()) {
                setCourseFormError("Barcha maydonlarni to'ldiring")
                return
            }
        } else {
            const hasAnyValue = [courseForm.name, courseForm.duration_hours, courseForm.duration_month, courseForm.price, courseForm.description].some(value => String(value).trim() !== "")
            if (!hasAnyValue) {
                setCourseFormError("Kamida bitta maydonni o'zgartiring")
                return
            }
        }

        setCourseSaving(true)
        setCourseFormError("")

        try {
            const payload = isUpdate
                ? {
                    ...(courseForm.name.trim() ? { name: courseForm.name.trim() } : {}),
                    ...(courseForm.duration_hours ? { duration_hours: Number(courseForm.duration_hours) } : {}),
                    ...(courseForm.duration_month ? { duration_month: Number(courseForm.duration_month) } : {}),
                    ...(courseForm.price ? { price: Number(courseForm.price) } : {}),
                    ...(courseForm.description.trim() ? { description: courseForm.description.trim() } : {}),
                }
                : {
                    name: courseForm.name.trim(),
                    duration_hours: Number(courseForm.duration_hours),
                    duration_month: Number(courseForm.duration_month),
                    price: Number(courseForm.price),
                    description: courseForm.description.trim(),
                }

            const response = await fetch(
                isUpdate
                    ? `https://najot-edu.softwareengineer.uz/api/v1/courses/${editingCourse.id}`
                    : "https://najot-edu.softwareengineer.uz/api/v1/courses",
                {
                    method: isUpdate ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                    },
                    body: JSON.stringify(payload)
                }
            )

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.message || (isUpdate ? "Kursni yangilashda xatolik yuz berdi" : "Kurs qo'shishda xatolik yuz berdi"))
            }

            if (isUpdate) {
                setCoursesList(prev => prev.map(item => item.id === editingCourse.id
                    ? {
                        ...item,
                        title: payload.name || item.title,
                        desc: payload.description || item.desc,
                        duration: payload.duration_hours || item.durationHours || item.duration,
                        period: payload.duration_month ? `${payload.duration_month} oy` : item.period,
                        price: payload.price ? `${Number(payload.price).toLocaleString()} so'm` : item.price,
                        priceValue: payload.price || item.priceValue,
                        durationHours: payload.duration_hours || item.durationHours,
                        durationMonth: payload.duration_month || item.durationMonth,
                        description: payload.description || item.description,
                    }
                    : item
                ))
                showToast("success", "Kurs muvaffaqiyatli yangilandi")
            } else {
                const createdCourse = data.data || data
                setCoursesList(prev => [
                    {
                        id: createdCourse.id || createdCourse._id || Date.now(),
                        title: createdCourse.name || courseForm.name.trim(),
                        desc: createdCourse.description || courseForm.description.trim(),
                        duration: createdCourse.duration_hours || createdCourse.durationHours || courseForm.duration_hours,
                        period: createdCourse.duration_month || createdCourse.durationMonth || courseForm.duration_month ? `${createdCourse.duration_month || createdCourse.durationMonth || courseForm.duration_month} oy` : "Noma'lum",
                        price: createdCourse.price ? `${Number(createdCourse.price).toLocaleString()} so'm` : `${Number(courseForm.price).toLocaleString()} so'm`,
                        priceValue: createdCourse.price || Number(courseForm.price),
                        durationHours: createdCourse.duration_hours || createdCourse.durationHours || courseForm.duration_hours,
                        durationMonth: createdCourse.duration_month || createdCourse.durationMonth || courseForm.duration_month,
                        description: createdCourse.description || courseForm.description.trim(),
                        color: cardColors[(prev.length + 1) % cardColors.length],
                    },
                    ...prev,
                ])
                showToast("success", "Kurs muvaffaqiyatli qo'shildi")
            }

            resetCourseForm()
            setIsDrawerOpen(false)
            await fetchCourses()
        } catch (err) {
            setCourseFormError(err.message || (isUpdate ? "Kursni yangilashda xatolik yuz berdi" : "Kurs qo'shishda xatolik yuz berdi"))
        } finally {
            setCourseSaving(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    const confirmDelete = (id) => {
        setCourseToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!courseToDelete) return;
        const token = localStorage.getItem("token")
        
        try {
            const response = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/courses/${courseToDelete}`, {
                method: "DELETE",
                headers: token ? { "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}` } : {}
            })
            
            if (response.ok) {
                setCoursesList(prev => prev.filter(c => c.id !== courseToDelete))
                showToast("success", "Kurs muvaffaqiyatli o'chirildi")
            } else {
                const data = await response.json().catch(() => ({}))
                showToast("error", data.message || "O'chirishda xatolik yuz berdi")
            }
        } catch (error) {
            console.error("Error deleting course:", error)
            showToast("error", "Server bilan bog'lanishda xatolik")
        } finally {
            setIsDeleteModalOpen(false)
            setCourseToDelete(null)
        }
    }

    return (
        <div className="relative">
            <div className="flex justify-between items-start mb-[20px]">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[22px] font-[600]">Kurslar</h3>
                        <button onClick={() => fetchCourses()} className="text-gray-400 hover:text-purple-600" disabled={loading}>
                            <i className={`fa-solid fa-rotate-right cursor-pointer ${loading ? 'animate-spin' : ''}`}></i>
                        </button>
                    </div>
                    <div className="flex items-center gap-8 mt-4">
                        <button 
                            onClick={() => {
                                setShowArchive(false);
                                fetchCourses(false);
                            }}
                            className={`text-[15px] font-[600] transition-colors ${!showArchive ? 'text-[#3366FF]' : 'text-[#475569] hover:text-[#3366FF]'}`}
                        >
                            Kurslar
                        </button>
                        <button 
                            onClick={() => {
                                setShowArchive(true);
                                fetchCourses(true);
                            }}
                            className={`text-[15px] font-[600] flex items-center gap-2 transition-colors ${showArchive ? 'text-[#3366FF]' : 'text-[#475569] hover:text-[#3366FF]'}`}
                        >
                            <i className="fa-solid fa-box-archive text-[14px]"></i> Arxiv
                        </button>
                    </div>
                </div>
                <Button
                    variant="contained"
                    onClick={() => setIsDrawerOpen(true)}
                    sx={{ bgcolor: '#7c3aed', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    + Kurs qo'shish
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500 font-[600]">Kurslar yuklanmoqda...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500 font-[600]">{error}</div>
            ) : coursesList.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-[600]">Kurslar topilmadi</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                    {coursesList.map(course => (
                        <div key={course.id} className={`rounded-[14px] p-[16px] border ${course.color} min-h-[160px] flex flex-col justify-between shadow-sm`}>
                            <div>
                                <p className="text-[14px] font-[600] text-gray-800 mb-[6px]">{course.title}</p>
                                <p className="text-[12px] text-gray-500 leading-[1.4]">{course.desc}</p>
                            </div>
                            <div className="flex items-center justify-between mt-[12px]">
                                <span className="text-[11px] bg-white border border-gray-200 rounded-[6px] px-[8px] py-[3px] font-[600]">{course.price}</span>
                                <div className="flex gap-[6px]">
                                    <i 
                                        className="fa-regular fa-trash-can text-gray-400 hover:text-red-500 cursor-pointer"
                                        onClick={() => confirmDelete(course.id)}
                                    ></i>
                                    <i
                                        className="fa-regular fa-pen-to-square text-gray-400 hover:text-purple-600 cursor-pointer"
                                        onClick={() => openEditCourse(course)}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-[380px] rounded-[16px] shadow-2xl p-[24px] animate-fade-in relative">
                        <h3 className="text-[20px] font-[700] text-gray-800 mb-2">Kursni o'chirish</h3>
                        <p className="text-[15px] text-gray-600 mb-[32px]">Rostdan ham o'chirishni xohlaysizmi?</p>
                        
                        <div className="flex justify-end gap-[12px]">
                            <button 
                                className="px-[20px] py-[10px] text-[15px] font-[600] text-gray-500 hover:bg-gray-50 rounded-[10px] transition-colors"
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setCourseToDelete(null)
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

            {/* Kurs qo'shish Drawer */}
            {isDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-[200] flex justify-end"
                    onClick={() => { setIsDrawerOpen(false); resetCourseForm(); }}
                >
                    <div 
                        className="w-[450px] h-full bg-white shadow-2xl flex flex-col animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="p-[24px] border-b relative">
                            <h3 className="text-[20px] font-[700] mb-1">{editingCourse ? "Kursni yangilash" : "Kurs qo'shish"}</h3>
                            <p className="text-[13px] text-gray-500">{editingCourse ? "Faqat o'zgartirmoqchi bo'lgan maydonlarni kiriting." : "Bu yerda siz yangi kurs qo'shishingiz mumkin."}</p>
                            <i 
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[20px] hover:text-red-500"
                                onClick={() => { setIsDrawerOpen(false); resetCourseForm(); }}
                            ></i>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto p-[24px] space-y-[20px]">
                            {/* Nomi */}
                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Nomi</label>
                                <input 
                                    type="text"
                                    value={courseForm.name}
                                    onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Masalan: Frontend Foundation"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 font-[500]"
                                />
                            </div>

                            {/* Dars davomiyligi */}
                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Dars davomiyligi (soat)</label>
                                <div className="relative">
                                    <select
                                        value={courseForm.duration_hours}
                                        onChange={(e) => setCourseForm(prev => ({ ...prev, duration_hours: e.target.value }))}
                                        className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-blue-500 appearance-none bg-white font-[500]"
                                    >
                                        <option value="">Tanlang</option>
                                        <option value="1">1 soat</option>
                                        <option value="2">2 soat</option>
                                        <option value="3">3 soat</option>
                                        <option value="4">4 soat</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-[14px] top-[16px] text-gray-400 text-[12px]"></i>
                                </div>
                            </div>

                            {/* Kurs davomiyligi (oylarda) */}
                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Kurs davomiyligi (oylarda)</label>
                                <div className="relative">
                                    <select
                                        value={courseForm.duration_month}
                                        onChange={(e) => setCourseForm(prev => ({ ...prev, duration_month: e.target.value }))}
                                        className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 appearance-none bg-white font-[500]"
                                    >
                                        <option value="">Tanlang</option>
                                        <option value="1">1 oy</option>
                                        <option value="2">2 oy</option>
                                        <option value="3">3 oy</option>
                                        <option value="6">6 oy</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-[14px] top-[16px] text-gray-400 text-[12px]"></i>
                                </div>
                            </div>

                            {/* Narx */}
                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Narx</label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={courseForm.price}
                                    onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="Narxini kiriting"
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[15px] font-[700] text-[#2d3748] mb-[8px]">Description</label>
                                <textarea
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Kurs haqida qisqacha ma'lumot..."
                                    className="w-full px-[14px] py-[12px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 min-h-[120px] resize-none text-gray-500"
                                ></textarea>
                                <p className="text-[12px] text-gray-400 mt-2">Kurs tavsifi ko'rsatiladi.</p>
                            </div>
                            {courseFormError && <p className="text-[13px] text-red-500">{courseFormError}</p>}
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-[24px] border-t bg-white flex gap-[12px]">
                            <button className="flex-1 py-[12px] text-[#2d3748] font-[700] border border-gray-200 rounded-[12px] bg-[#edf2f7] hover:bg-gray-200 transition-colors" onClick={() => { setIsDrawerOpen(false); resetCourseForm(); }}>Bekor qilish</button>
                            <button
                                className="flex-1 py-[12px] bg-[#6366f1] text-white font-[700] rounded-[12px] hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-300"
                                onClick={handleSaveCourse}
                                disabled={courseSaving}
                            >
                                {courseSaving ? "Saqlanmoqda..." : (editingCourse ? "Yangilash" : "Saqlash")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Settings() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const activeTab = searchParams.get("tab") || "Kurslar"
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const setActiveTab = (tab) => router.push(pathname + "?tab=" + tab)
    const isWhiteBackground = activeTab === "Kurslar" || activeTab === "Xonalar"

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col">
                    <div className="px-[20px] md:px-[40px] bg-gray-50 pb-[20px]">
                        <Header onMenuClick={() => setIsSidebarOpen(true)} />
                        <div className="mt-[20px]">
                            <h2 className="text-[28px] font-[700] mb-[4px]">Boshqarish</h2>
                            <p className="text-gray-500 text-[14px] mb-[24px]">Tizim parametrlarini va bo'limlarini shu yerda boshqarishingiz mumkin.</p>
                        </div>
                        <div className="flex flex-wrap gap-[4px] border-b border-gray-200">
                            {tabs.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-[16px] py-[10px] text-[14px] font-[500] border-b-2 transition-colors ${activeTab === tab ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-purple-500"}`}>{tab}</button>
                            ))}
                        </div>
                    </div>
                    <div className={`flex-1 px-[20px] md:px-[40px] pt-[30px] pb-[40px] ${isWhiteBackground ? 'bg-white' : 'bg-gray-50'}`}>
                        {activeTab === "Kurslar" && <KurslarTab />}
                        {activeTab === "Xonalar" && <XonalarTab />}
                        {activeTab !== "Kurslar" && activeTab !== "Xonalar" && <div className="text-gray-400 text-[16px] mt-[40px]">{activeTab} bo'limi tez kunda qo'shiladi...</div>}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } } 
                .animate-slide-in { animation: slide-in 0.3s ease-out; }
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes toast-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-toast-up { animation: toast-up 0.3s ease-out; }
            ` }} />
        </div>
    )
}
