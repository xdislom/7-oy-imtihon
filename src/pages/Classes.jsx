import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { Button, Switch, Checkbox, Radio } from "@mui/material"

const findGroupsArray = (obj) => {
    if (Array.isArray(obj)) return obj
    if (!obj || typeof obj !== 'object') return []

    if (Array.isArray(obj.data)) return obj.data
    if (obj.data && Array.isArray(obj.data.data)) return obj.data.data
    if (obj.data && Array.isArray(obj.data.groups)) return obj.data.groups
    if (Array.isArray(obj.groups)) return obj.groups
    if (Array.isArray(obj.items)) return obj.items
    if (Array.isArray(obj.rows)) return obj.rows
    if (Array.isArray(obj.list)) return obj.list

    for (const key of Object.keys(obj)) {
        if (Array.isArray(obj[key])) return obj[key]
        if (obj[key] && typeof obj[key] === 'object') {
            const nested = findGroupsArray(obj[key])
            if (nested.length > 0) return nested
        }
    }

    return []
}

const findRoomsArray = (obj) => {
    if (Array.isArray(obj)) return obj
    if (!obj || typeof obj !== 'object') return []

    if (Array.isArray(obj.data)) return obj.data
    if (obj.data && Array.isArray(obj.data.data)) return obj.data.data
    if (obj.data && Array.isArray(obj.data.rooms)) return obj.data.rooms
    if (Array.isArray(obj.rooms)) return obj.rooms
    if (Array.isArray(obj.items)) return obj.items
    if (Array.isArray(obj.rows)) return obj.rows
    if (Array.isArray(obj.list)) return obj.list

    for (const key of Object.keys(obj)) {
        if (Array.isArray(obj[key])) return obj[key]
        if (obj[key] && typeof obj[key] === 'object') {
            const nested = findRoomsArray(obj[key])
            if (nested.length > 0) return nested
        }
    }

    return []
}

const findCoursesArray = (obj) => {
    if (Array.isArray(obj)) return obj
    if (!obj || typeof obj !== 'object') return []

    if (Array.isArray(obj.data)) return obj.data
    if (obj.data && Array.isArray(obj.data.data)) return obj.data.data
    if (obj.data && Array.isArray(obj.data.courses)) return obj.data.courses
    if (Array.isArray(obj.courses)) return obj.courses
    if (Array.isArray(obj.items)) return obj.items
    if (Array.isArray(obj.rows)) return obj.rows
    if (Array.isArray(obj.list)) return obj.list

    for (const key of Object.keys(obj)) {
        if (Array.isArray(obj[key])) return obj[key]
        if (obj[key] && typeof obj[key] === 'object') {
            const nested = findCoursesArray(obj[key])
            if (nested.length > 0) return nested
        }
    }

    return []
}

const getName = (value, fallback = "Noma'lum") => {
    if (!value) return fallback
    if (typeof value === 'string') return value
    return value.name || value.title || value.full_name || fallback
}

const getCount = (value) => {
    if (Array.isArray(value)) return value.length
    if (typeof value === 'number') return value
    return 0
}

const formatDays = (value) => {
    if (Array.isArray(value)) return value.map(day => getName(day, day)).join(', ')
    return value || "Noma'lum"
}

const formatDuration = (group) => {
    const duration = group.duration || group.duration_month || group.month
    if (!duration) return "Noma'lum"
    if (typeof duration === 'string' && duration.toLowerCase().includes('oy')) return duration
    return `${duration} oy`
}

const normalizeGroup = (group, index) => ({
    id: group.id || group._id || index + 1,
    status: group.status === undefined ? true : Boolean(group.status),
    name: group.name || group.title || group.group_name || "Noma'lum guruh",
    course: getName(group.course || group.subject || group.direction, "Noma'lum"),
    duration: formatDuration(group),
    time: group.time || group.lesson_time || group.start_time || "Noma'lum",
    days: formatDays(group.days || group.lesson_days || group.week_days || group.week_day),
    room: getName(group.room || group.classroom || group.room_name || group.roomName, "Noma'lum"),
    teacher: getName(group.teacher || group.mentor || group.teachers?.[0], "Noma'lum"),
    students: getCount(group.students || group.student_count || group.students_count),
    maxStudent: group.max_student || group.maxStudent || group.room?.capacity || group.capacity || 0,
    startDate: group.start_date || group.startDate || group.begin_date || group.beginDate,
    endDate: group.end_date || group.endDate || group.finish_date || group.finishDate
})

const normalizeRoom = (room, index) => ({
    id: room.id || room._id || index + 1,
    name: room.name || room.title || `Xona ${index + 1}`,
    capacity: room.capacity || room.max_student || room.maxStudent || 0
})

const normalizeCourse = (course, index) => ({
    id: course.id || course._id || index + 1,
    name: course.name || course.title || `Kurs ${index + 1}`,
    durationMonth: course.duration_month || course.durationMonth || course.month || "",
    price: course.price || 0
})

const GROUP_ENDPOINTS = [
    "https://najot-edu.softwareengineer.uz/api/v1/groups/all",
    "https://najot-edu.softwareengineer.uz/api/v1/students/my/groups"
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
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("Guruhlar")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false)
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
    const [groups, setGroups] = useState([])
    const [rooms, setRooms] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [coursesLoading, setCoursesLoading] = useState(false)
    const [courseError, setCourseError] = useState("")
    const [roomsLoading, setRoomsLoading] = useState(false)
    const [roomError, setRoomError] = useState("")
    const [roomSaving, setRoomSaving] = useState(false)
    
    const [selectedStudents, setSelectedStudents] = useState([])
    const [selectedTeacher, setSelectedTeacher] = useState("")
    const [selectedCourseId, setSelectedCourseId] = useState("")
    const [selectedRoomId, setSelectedRoomId] = useState("")
    const [roomName, setRoomName] = useState("")
    const [roomCapacity, setRoomCapacity] = useState("")

    const fetchGroups = async () => {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token")

        if (!token || token === "undefined" || token === "null") {
            setLoading(false)
            setError("Avval tizimga kiring")
            navigate("/")
            return
        }

        try {
            let response = null
            let data = null

            for (const endpoint of GROUP_ENDPOINTS) {
                response = await fetch(endpoint, {
                    headers: {
                        "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                    }
                })
                data = await response.json()
                if (response.ok || response.status !== 401) break
            }

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token")
                    navigate("/")
                    return
                }
                throw new Error(data.message || "Guruhlarni olishda xatolik yuz berdi")
            }

            const list = findGroupsArray(data)
            setGroups(list.map(normalizeGroup))
        } catch (error) {
            console.error("Error fetching groups:", error)
            setError(error.message || "Server bilan bog'lanishda xatolik!")
        } finally {
            setLoading(false)
        }
    }

    const fetchRooms = async () => {
        setRoomsLoading(true)
        setRoomError("")
        const token = localStorage.getItem("token")

        if (!token || token === "undefined" || token === "null") {
            setRoomsLoading(false)
            setRoomError("Avval tizimga kiring")
            return
        }

        try {
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/rooms", {
                headers: {
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Xonalarni olishda xatolik yuz berdi")
            }

            const list = findRoomsArray(data)
            setRooms(list.map(normalizeRoom))
        } catch (error) {
            console.error("Error fetching rooms:", error)
            setRoomError(error.message || "Xonalarni yuklashda xatolik!")
        } finally {
            setRoomsLoading(false)
        }
    }

    const fetchCourses = async () => {
        setCoursesLoading(true)
        setCourseError("")
        const token = localStorage.getItem("token")

        if (!token || token === "undefined" || token === "null") {
            setCoursesLoading(false)
            setCourseError("Avval tizimga kiring")
            return
        }

        try {
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/courses", {
                headers: {
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                }
            })

            const data = await response.json()
            console.log("RAW COURSES API RESPONSE:", data)

            if (!response.ok) {
                throw new Error(data.message || "Kurslarni olishda xatolik yuz berdi")
            }

            const list = findCoursesArray(data)
            console.log("EXTRACTED COURSES ARRAY:", list)
            
            if (list.length === 0) {
                setCourseError("Ma'lumot topilmadi: " + JSON.stringify(data).substring(0, 100))
            }
            
            setCourses(list.map(normalizeCourse))
        } catch (error) {
            console.error("Error fetching courses:", error)
            setCourseError(error.message || "Kurslarni yuklashda xatolik!")
        } finally {
            setCoursesLoading(false)
        }
    }

    const handleSaveRoom = async () => {
        if (!roomName.trim() || !roomCapacity) {
            setRoomError("Xona nomi va sig'imini kiriting")
            return
        }

        setRoomSaving(true)
        setRoomError("")
        const token = localStorage.getItem("token")

        if (!token || token === "undefined" || token === "null") {
            setRoomSaving(false)
            setRoomError("Avval tizimga kiring")
            return
        }

        try {
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                },
                body: JSON.stringify({
                    name: roomName.trim(),
                    capacity: Number(roomCapacity)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Xona qo'shishda xatolik yuz berdi")
            }

            const newRoom = normalizeRoom(data.data || data, rooms.length)
            setRooms(prev => [...prev, newRoom])
            setSelectedRoomId(String(newRoom.id))
            setRoomName("")
            setRoomCapacity("")
            setIsRoomModalOpen(false)
            fetchRooms()
        } catch (error) {
            console.error("Error saving room:", error)
            setRoomError(error.message || "Xona qo'shishda xatolik!")
        } finally {
            setRoomSaving(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGroups()
            fetchCourses()
            fetchRooms()
        }, 0)
        return () => clearTimeout(timer)
    }, [])

    const totalTeachers = new Set(groups.map(group => group.teacher).filter(teacher => teacher && teacher !== "Noma'lum")).size
    const totalStudents = groups.reduce((sum, group) => sum + group.students, 0)

    return (
        <div className="w-full bg-gray-50 min-h-screen">
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
                            onClick={() => setActiveTab("Kurslar")}
                            className={`px-[16px] py-[6px] rounded-[8px] text-[14px] font-[600] transition-colors ${activeTab === "Kurslar" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}
                        >
                            Kurslar
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
                            <h3 className="text-[32px] font-[700]">{groups.length}</h3>
                            <i className="fa-solid fa-ellipsis-vertical absolute top-[24px] right-[24px] text-gray-300 cursor-pointer"></i>
                        </div>
                        <div className="bg-white p-[24px] rounded-[16px] border border-gray-100 shadow-sm relative">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <i className="fa-solid fa-user-group text-[14px]"></i>
                                <span className="text-[13px] font-[500]">O'qituvchilar</span>
                            </div>
                            <h3 className="text-[32px] font-[700]">{totalTeachers}</h3>
                            <i className="fa-solid fa-ellipsis-vertical absolute top-[24px] right-[24px] text-gray-300 cursor-pointer"></i>
                        </div>
                        <div className="bg-white p-[24px] rounded-[16px] border border-gray-100 shadow-sm relative">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <i className="fa-solid fa-graduation-cap text-[14px]"></i>
                                <span className="text-[13px] font-[500]">O'quvchilar</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-[32px] font-[700]">{totalStudents}</h3>
                                <div className="flex -space-x-2">
                                    <div className="w-[24px] h-[24px] rounded-full bg-black text-white text-[10px] flex items-center justify-center border-2 border-white">I</div>
                                    <div className="w-[24px] h-[24px] rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center border-2 border-white">M</div>
                                    <div className="w-[24px] h-[24px] rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center border-2 border-white">S</div>
                                </div>
                            </div>
                            <i className="fa-solid fa-ellipsis-vertical absolute top-[24px] right-[24px] text-gray-300 cursor-pointer"></i>
                        </div>
                    </div>

                    {/* Content Area */}
                    {activeTab === "Guruhlar" && (
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
                                        <th className="py-[16px] px-[24px] text-right">
                                            <button onClick={fetchGroups} className="text-gray-400 hover:text-purple-600" disabled={loading}>
                                                <i className={`fa-solid fa-rotate-right cursor-pointer ${loading ? 'animate-spin' : ''}`}></i>
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-[14px]">
                                    {loading && (
                                        <tr>
                                            <td colSpan="9" className="py-[28px] px-[24px] text-center text-gray-400 font-[600]">
                                                Guruhlar yuklanmoqda...
                                            </td>
                                        </tr>
                                    )}

                                    {!loading && error && (
                                        <tr>
                                            <td colSpan="9" className="py-[28px] px-[24px] text-center text-red-500 font-[600]">
                                                {error}
                                            </td>
                                        </tr>
                                    )}

                                    {!loading && !error && groups.length === 0 && (
                                        <tr>
                                            <td colSpan="9" className="py-[28px] px-[24px] text-center text-gray-400 font-[600]">
                                                Guruhlar topilmadi
                                            </td>
                                        </tr>
                                    )}

                                    {!loading && !error && groups.map((group) => (
                                        <tr
                                            key={group.id}
                                            onClick={() => {
                                                sessionStorage.setItem("selectedGroup", JSON.stringify(group))
                                                navigate(`/classes/groups/${group.id}`)
                                            }}
                                            className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                                        >
                                            <td className="py-[16px] px-[24px]">
                                                <div className="flex items-center gap-2">
                                                    <Switch 
                                                        onClick={(e) => e.stopPropagation()}
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
                                            <td className="py-[16px] px-[24px] text-right" onClick={(e) => e.stopPropagation()}>
                                                <i className="fa-solid fa-ellipsis-vertical text-gray-300 cursor-pointer hover:text-gray-600"></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    )}

                    {activeTab === "Kurslar" && (
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50">
                                        <tr className="text-gray-400 text-[12px] font-[600] uppercase tracking-wider">
                                            <th className="py-[16px] px-[24px]">#</th>
                                            <th className="py-[16px] px-[24px]">Kurs nomi</th>
                                            <th className="py-[16px] px-[24px]">Davomiyligi</th>
                                            <th className="py-[16px] px-[24px]">Narxi</th>
                                            <th className="py-[16px] px-[24px] text-right">
                                                <button onClick={fetchCourses} className="text-gray-400 hover:text-purple-600" disabled={coursesLoading}>
                                                    <i className={`fa-solid fa-rotate-right cursor-pointer ${coursesLoading ? 'animate-spin' : ''}`}></i>
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[14px]">
                                        {coursesLoading && (
                                            <tr>
                                                <td colSpan="5" className="py-[28px] px-[24px] text-center text-gray-400 font-[600]">
                                                    Kurslar yuklanmoqda...
                                                </td>
                                            </tr>
                                        )}

                                        {!coursesLoading && courseError && (
                                            <tr>
                                                <td colSpan="5" className="py-[28px] px-[24px] text-center text-red-500 font-[600]">
                                                    {courseError}
                                                </td>
                                            </tr>
                                        )}

                                        {!coursesLoading && !courseError && courses.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-[28px] px-[24px] text-center text-gray-400 font-[600]">
                                                    Kurslar topilmadi
                                                </td>
                                            </tr>
                                        )}

                                        {!coursesLoading && !courseError && courses.map((course, index) => (
                                            <tr key={course.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                                                <td className="py-[16px] px-[24px] font-[600] text-gray-500">{index + 1}</td>
                                                <td className="py-[16px] px-[24px] font-[700] text-gray-800">{course.name}</td>
                                                <td className="py-[16px] px-[24px] text-gray-600 font-[500]">{course.durationMonth ? `${course.durationMonth} oy` : "-"}</td>
                                                <td className="py-[16px] px-[24px] text-gray-600 font-[500]">{course.price ? `${course.price.toLocaleString()} so'm` : "-"}</td>
                                                <td className="py-[16px] px-[24px] text-right">
                                                    <i className="fa-solid fa-ellipsis-vertical text-gray-300 cursor-pointer hover:text-gray-600"></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
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
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 appearance-none bg-white font-[500]"
                                        disabled={coursesLoading}
                                    >
                                        <option value="">{coursesLoading ? "Kurslar yuklanmoqda..." : "Tanlang"}</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name}{course.durationMonth ? ` (${course.durationMonth} oy)` : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-[14px] top-[14px] text-gray-400 text-[12px]"></i>
                                </div>
                                {courseError && (
                                    <p className="text-[12px] text-red-500 font-[500] mt-[8px]">{courseError}</p>
                                )}
                            </div>

                            {/* Xona */}
                            <div>
                                <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Xona <span className="text-red-500">*</span></label>
                                <div className="relative mb-[10px]">
                                    <select
                                        value={selectedRoomId}
                                        onChange={(e) => setSelectedRoomId(e.target.value)}
                                        className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500 appearance-none bg-white font-[500]"
                                        disabled={roomsLoading}
                                    >
                                        <option value="">{roomsLoading ? "Xonalar yuklanmoqda..." : "Tanlang"}</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.name}{room.capacity ? ` (${room.capacity} o'rin)` : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fa-solid fa-chevron-down absolute right-[14px] top-[14px] text-gray-400 text-[12px]"></i>
                                </div>
                                {roomError && (
                                    <p className="text-[12px] text-red-500 font-[500] mb-[10px]">{roomError}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsRoomModalOpen(true)}
                                    className="w-full py-[10px] border-2 border-dashed border-gray-200 rounded-[12px] flex items-center justify-center gap-[8px] text-purple-600 font-[600] hover:bg-purple-50 transition-colors"
                                >
                                    <i className="fa-solid fa-plus"></i> Yangi xona qo'shish
                                </button>
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

            {/* Xona qo'shish Modal */}
            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-[20px]">
                    <div className="bg-white w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden animate-fade-in">
                        <div className="p-[24px] relative">
                            <h3 className="text-[18px] font-[700] text-gray-800 mb-1">Yangi xona qo'shish</h3>
                            <p className="text-[13px] text-gray-500 mb-[20px]">Xona nomi va sig'imini kiriting</p>
                            <i
                                className="fa-solid fa-xmark absolute top-[24px] right-[24px] text-gray-400 cursor-pointer text-[18px] hover:text-red-500"
                                onClick={() => setIsRoomModalOpen(false)}
                            ></i>

                            <div className="space-y-[16px] mb-[20px]">
                                <div>
                                    <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Xona nomi</label>
                                    <input
                                        type="text"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        placeholder="Masalan: Autodesk"
                                        className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[14px] font-[600] text-gray-800 mb-[8px]">Sig'imi</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={roomCapacity}
                                        onChange={(e) => setRoomCapacity(e.target.value)}
                                        placeholder="Masalan: 20"
                                        className="w-full px-[14px] py-[10px] border border-gray-200 rounded-[12px] outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {roomError && (
                                <p className="text-[13px] text-red-500 font-[500] mb-[16px]">{roomError}</p>
                            )}

                            <div className="flex justify-end gap-[12px]">
                                <button
                                    className="px-[20px] py-[10px] text-gray-500 font-[600] hover:text-gray-800"
                                    onClick={() => setIsRoomModalOpen(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    className={`px-[30px] py-[10px] font-[600] rounded-[12px] transition-colors shadow-md ${roomSaving ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                                    onClick={handleSaveRoom}
                                    disabled={roomSaving}
                                >
                                    {roomSaving ? "Saqlanmoqda..." : "Saqlash"}
                                </button>
                            </div>
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
