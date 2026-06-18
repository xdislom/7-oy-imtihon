import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherSidebar from "../components/TeacherSidebar"
import Header from "../components/Header"
import { Switch } from "@mui/material"

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
    const dayMap = {
        MONDAY: "Du", TUESDAY: "Se", WEDNESDAY: "Chor",
        THURSDAY: "Pay", FRIDAY: "Ju", SATURDAY: "Shan", SUNDAY: "Yak"
    }
    if (Array.isArray(value)) return value.map(d => dayMap[String(d).toUpperCase()] || d).join(', ')
    if (typeof value === 'string') return value.split(',').map(d => dayMap[d.trim().toUpperCase()] || d.trim()).join(', ')
    return "Noma'lum"
}

const formatDuration = (group) => {
    const duration = group.duration || group.duration_month || group.month
    if (!duration) return "Noma'lum"
    if (typeof duration === 'string' && duration.toLowerCase().includes('oy')) return duration
    return `${duration} oy`
}

const normalizeGroup = (group, index) => ({
    id: group.id || group._id || index + 1,
    status: group.status === undefined ? false : Boolean(group.status),
    name: group.name || group.title || group.group_name || "Noma'lum guruh",
    course: getName(group.course || group.subject || group.direction, "Noma'lum"),
    duration: formatDuration(group),
    time: group.time || group.lesson_time || group.start_time || "Noma'lum",
    days: formatDays(group.days || group.lesson_days || group.week_days || group.week_day),
    room: getName(group.room || group.classroom || group.room_name, "Noma'lum"),
    teacher: getName(group.teacher || group.mentor || group.teachers?.[0], "Noma'lum"),
    students: getCount(group.students || group.student_count || group.students_count),
})

export default function TeacherPlannedGroups() {
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("Guruhlar")
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchGroups = async () => {
        setLoading(true)
        const token = localStorage.getItem("token") || ""
        const endpoints = [
            "https://najot-edu.softwareengineer.uz/api/v1/groups/planned",
            "https://najot-edu.softwareengineer.uz/api/v1/teachers/my/planned-groups",
            "https://najot-edu.softwareengineer.uz/api/v1/groups/collecting",
        ]
        for (const url of endpoints) {
            try {
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!res.ok) continue
                const data = await res.json()
                const arr = findGroupsArray(data)
                if (arr.length > 0) {
                    setGroups(arr.map(normalizeGroup))
                    setLoading(false)
                    return
                }
            } catch (_) { /* try next */ }
        }
        setGroups([])
        setLoading(false)
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="flex">
                <TeacherSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    {/* Page Header */}
                    <div className="flex justify-between items-center mt-[20px] mb-[24px]">
                        <h2 className="text-[28px] font-[700] text-gray-900">Yig'ilayotgan guruhlar</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-[8px] mb-[24px] bg-gray-100 p-1 rounded-[10px] w-fit">
                        <button
                            onClick={() => setActiveTab("Guruhlar")}
                            className={`px-[16px] py-[6px] rounded-[8px] text-[14px] font-[600] transition-colors ${
                                activeTab === "Guruhlar" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Guruhlar
                        </button>
                        <button
                            onClick={() => setActiveTab("Arxiv")}
                            className={`px-[16px] py-[6px] rounded-[8px] text-[14px] font-[600] flex items-center gap-2 transition-colors ${
                                activeTab === "Arxiv" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <i className="fa-solid fa-box-archive text-[12px]"></i> Arxiv
                        </button>
                    </div>

                    {/* Table */}
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
                                                <td colSpan="9" className="py-8 px-6 text-center text-gray-400 font-semibold">
                                                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                                                    Yuklanmoqda...
                                                </td>
                                            </tr>
                                        )}
                                        {!loading && groups.length === 0 && (
                                            <tr>
                                                <td colSpan="9" className="py-12 px-6 text-center text-gray-400 font-semibold">
                                                    Hozircha guruhlar yo'q
                                                </td>
                                            </tr>
                                        )}
                                        {!loading && groups.map((group) => (
                                            <tr
                                                key={group.id}
                                                onClick={() => {
                                                    sessionStorage.setItem("selectedGroup", JSON.stringify(group))
                                                    navigate(`/dashboard/groups/${group.id}`)
                                                }}
                                                className="border-t border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer"
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
                                                        <span className={`text-[11px] font-[700] ${group.status ? 'text-green-500' : 'text-yellow-500'}`}>
                                                            {group.status ? 'FAOL' : 'KUTMOQDA'}
                                                        </span>
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
                                                    <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "Arxiv" && (
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-8 text-center">
                            <i className="fa-solid fa-box-archive text-[40px] text-gray-200 mb-3 block"></i>
                            <p className="text-gray-400 font-semibold">Arxiv guruhlar topilmadi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
