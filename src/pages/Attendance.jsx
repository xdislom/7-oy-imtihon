import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const STATUS_CONFIG = {
    present:  { label: "Keldi",     bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", icon: "fa-circle-check" },
    absent:   { label: "Kelmadi",   bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-500",     icon: "fa-circle-xmark" },
    late:     { label: "Kechikdi",  bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500",   icon: "fa-clock" },
    excused:  { label: "Sababli",   bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500",    icon: "fa-circle-exclamation" },
}

function getStatusKey(item) {
    const raw = (item.status || item.attendance_status || item.type || '').toLowerCase()
    if (raw.includes('present') || raw === 'keldi' || raw === '1' || raw === 'true') return 'present'
    if (raw.includes('late')    || raw === 'kechikdi')   return 'late'
    if (raw.includes('excused') || raw === 'sababli')    return 'excused'
    if (raw.includes('absent')  || raw === 'kelmadi' || raw === '0' || raw === 'false') return 'absent'
    // fallback: try boolean fields
    if (item.is_present === true || item.present === true)  return 'present'
    if (item.is_present === false || item.present === false) return 'absent'
    return 'present'
}

const AVATAR_COLORS = [
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-orange-100 text-orange-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
]

function flattenAttendance(data) {
    if (Array.isArray(data)) return data
    if (data?.data) {
        if (Array.isArray(data.data))              return data.data
        if (Array.isArray(data.data?.data))        return data.data.data
        if (Array.isArray(data.data?.items))       return data.data.items
        if (Array.isArray(data.data?.rows))        return data.data.rows
        if (Array.isArray(data.data?.attendance))  return data.data.attendance
    }
    if (Array.isArray(data?.items))      return data.items
    if (Array.isArray(data?.rows))       return data.rows
    if (Array.isArray(data?.attendance)) return data.attendance
    if (Array.isArray(data?.list))       return data.list
    // deep search
    for (const key of Object.keys(data || {})) {
        if (Array.isArray(data[key]) && data[key].length > 0) return data[key]
    }
    return []
}

function mapRecord(item, index) {
    const studentName =
        item.student_name || item.studentName ||
        (item.student && (item.student.full_name || item.student.name)) ||
        item.full_name || item.name || "Noma'lum"

    const groupName =
        item.group_name  || item.groupName  ||
        (item.group  && (item.group.name  || item.group.title)) ||
        item.lesson_name || item.lesson || "—"

    const teacherName =
        item.teacher_name || item.teacherName ||
        (item.teacher && (item.teacher.full_name || item.teacher.name)) || "—"

    const rawDate = item.date || item.lesson_date || item.created_at || item.createdAt || null
    const date = rawDate ? new Date(rawDate).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "—"
    const time = rawDate ? new Date(rawDate).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : "—"

    return {
        id:          item.id || item._id || index,
        studentName,
        groupName,
        teacherName,
        date,
        time,
        statusKey:   getStatusKey(item),
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        initial:     studentName.charAt(0).toUpperCase(),
    }
}

export default function Attendance() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [records, setRecords]             = useState([])
    const [loading, setLoading]             = useState(true)
    const [error, setError]                 = useState(null)
    const [search, setSearch]               = useState('')
    const [filterStatus, setFilterStatus]   = useState('all')
    const [toast, setToast]                 = useState(null)

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const fetchAttendance = async () => {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token') || ''
        try {
            const res = await fetch('https://najot-edu.softwareengineer.uz/api/v1/attendance/all', {
                headers: {
                    Authorization: `Bearer ${token.replace(/^Bearer\s+/i, '')}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!res.ok) {
                const msg = `Server xatosi: ${res.status}`
                setError(msg)
                showToast('error', msg)
                return
            }
            const data = await res.json()
            console.log('Attendance raw response:', data)
            const list = flattenAttendance(data)
            console.log('Flattened attendance list:', list)
            setRecords(list.map(mapRecord))
        } catch (err) {
            console.error('Attendance fetch error:', err)
            const msg = "Server bilan bog'lanishda xatolik!"
            setError(msg)
            showToast('error', msg)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAttendance() }, [])

    const filtered = useMemo(() => {
        return records.filter(r => {
            const matchSearch =
                !search ||
                r.studentName.toLowerCase().includes(search.toLowerCase()) ||
                r.groupName.toLowerCase().includes(search.toLowerCase()) ||
                r.teacherName.toLowerCase().includes(search.toLowerCase())
            const matchStatus = filterStatus === 'all' || r.statusKey === filterStatus
            return matchSearch && matchStatus
        })
    }, [records, search, filterStatus])

    // Summary counts
    const counts = useMemo(() => ({
        total:   records.length,
        present: records.filter(r => r.statusKey === 'present').length,
        absent:  records.filter(r => r.statusKey === 'absent').length,
        late:    records.filter(r => r.statusKey === 'late').length,
        excused: records.filter(r => r.statusKey === 'excused').length,
    }), [records])

    const statCards = [
        { label: "Jami",       value: counts.total,   icon: "fa-clipboard-list",   color: "text-purple-600",  bg: "bg-purple-50"  },
        { label: "Keldi",      value: counts.present, icon: "fa-circle-check",     color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Kelmadi",    value: counts.absent,  icon: "fa-circle-xmark",     color: "text-red-500",     bg: "bg-red-50"     },
        { label: "Kechikdi",   value: counts.late,    icon: "fa-clock",            color: "text-amber-600",   bg: "bg-amber-50"   },
        { label: "Sababli",    value: counts.excused, icon: "fa-circle-exclamation", color: "text-blue-600",  bg: "bg-blue-50"    },
    ]

    return (
        <div className="max-w-[1600px] m-auto bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col">

                    {/* Header Area */}
                    <div className="px-[20px] md:px-[40px] bg-gray-50 pb-[20px]">
                        <Header onMenuClick={() => setIsSidebarOpen(true)} />

                        <div className="flex justify-between items-start mt-[20px] mb-[24px]">
                            <div>
                                <h2 className="text-[28px] font-[700] mb-[4px]">Davomat</h2>
                                <p className="text-gray-500 text-[14px] leading-relaxed">
                                    Barcha talabalarning davomat ma'lumotlari shu yerda ko'rsatiladi.
                                </p>
                            </div>
                            <button
                                onClick={fetchAttendance}
                                className="flex items-center gap-[8px] px-[16px] py-[10px] bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-[600] text-[14px] rounded-[12px] shadow-sm transition-all"
                            >
                                <i className="fa-solid fa-rotate-right"></i>
                                Yangilash
                            </button>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[14px] mb-[4px]">
                            {statCards.map(card => (
                                <div
                                    key={card.label}
                                    onClick={() => setFilterStatus(
                                        card.label === "Jami"     ? 'all'     :
                                        card.label === "Keldi"    ? 'present' :
                                        card.label === "Kelmadi"  ? 'absent'  :
                                        card.label === "Kechikdi" ? 'late'    : 'excused'
                                    )}
                                    className={`bg-white rounded-[16px] border border-gray-100 shadow-sm p-[18px] flex items-center gap-[14px] cursor-pointer hover:shadow-md transition-all group ${
                                        (filterStatus === 'all' && card.label === 'Jami') ||
                                        (filterStatus === 'present' && card.label === 'Keldi') ||
                                        (filterStatus === 'absent'  && card.label === 'Kelmadi') ||
                                        (filterStatus === 'late'    && card.label === 'Kechikdi') ||
                                        (filterStatus === 'excused' && card.label === 'Sababli')
                                            ? 'ring-2 ring-purple-400 ring-offset-1'
                                            : ''
                                    }`}
                                >
                                    <div className={`w-[42px] h-[42px] ${card.bg} rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <i className={`fa-solid ${card.icon} ${card.color} text-[18px]`}></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[12px] font-[500]">{card.label}</p>
                                        <p className="text-[22px] font-[800] text-gray-900 leading-tight">
                                            {loading ? '—' : card.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white px-[20px] md:px-[40px] pt-[30px] pb-[40px]">
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden p-[20px]">

                            {/* Filter Bar */}
                            <div className="flex flex-wrap justify-between items-center gap-[12px] mb-[20px]">
                                <div className="relative flex-1 min-w-[200px] max-w-[340px]">
                                    <i className="fa-solid fa-magnifying-glass absolute left-[12px] top-[12px] text-gray-300"></i>
                                    <input
                                        type="text"
                                        placeholder="Talaba, guruh yoki o'qituvchi qidirish..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-[36px] pr-[12px] py-[9px] bg-gray-50 border border-gray-100 rounded-[10px] outline-none text-[14px] focus:border-purple-300 transition-colors"
                                    />
                                </div>

                                <div className="flex items-center gap-[8px]">
                                    {['all','present','absent','late','excused'].map(key => {
                                        const labels = { all:'Barchasi', present:'Keldi', absent:'Kelmadi', late:'Kechikdi', excused:'Sababli' }
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setFilterStatus(key)}
                                                className={`px-[14px] py-[8px] rounded-[8px] text-[13px] font-[600] transition-all ${
                                                    filterStatus === key
                                                        ? 'bg-purple-600 text-white shadow-sm'
                                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                }`}
                                            >
                                                {labels[key]}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Table */}
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-[80px] gap-[16px]">
                                    <div className="w-[48px] h-[48px] border-[4px] border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                    <p className="text-gray-400 text-[15px] font-[500]">Ma'lumotlar yuklanmoqda...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-[80px] gap-[16px]">
                                    <div className="w-[64px] h-[64px] bg-red-50 rounded-full flex items-center justify-center">
                                        <i className="fa-solid fa-triangle-exclamation text-red-400 text-[24px]"></i>
                                    </div>
                                    <p className="text-gray-500 text-[15px] font-[500]">{error}</p>
                                    <button
                                        onClick={fetchAttendance}
                                        className="px-[20px] py-[10px] bg-purple-600 text-white font-[600] rounded-[10px] hover:bg-purple-700 transition-colors"
                                    >
                                        Qayta urinish
                                    </button>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-[80px] gap-[16px]">
                                    <div className="w-[64px] h-[64px] bg-gray-50 rounded-full flex items-center justify-center">
                                        <i className="fa-solid fa-clipboard-list text-gray-300 text-[28px]"></i>
                                    </div>
                                    <p className="text-gray-400 text-[15px] font-[500]">Ma'lumot topilmadi</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-gray-400 text-[12px] font-[700] uppercase tracking-wider border-b border-gray-100">
                                                <th className="py-[14px] px-[12px]">#</th>
                                                <th className="py-[14px] px-[12px]">Talaba</th>
                                                <th className="py-[14px] px-[12px]">Guruh</th>
                                                <th className="py-[14px] px-[12px]">O'qituvchi</th>
                                                <th className="py-[14px] px-[12px]">Sana</th>
                                                <th className="py-[14px] px-[12px]">Vaqt</th>
                                                <th className="py-[14px] px-[12px] text-center">Holat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[14px]">
                                            {filtered.map((rec, i) => {
                                                const st = STATUS_CONFIG[rec.statusKey] || STATUS_CONFIG.present
                                                return (
                                                    <tr
                                                        key={rec.id + '-' + i}
                                                        className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors"
                                                    >
                                                        <td className="py-[14px] px-[12px] text-gray-400 font-[500] text-[13px]">
                                                            {i + 1}
                                                        </td>
                                                        <td className="py-[14px] px-[12px]">
                                                            <div className="flex items-center gap-[10px]">
                                                                <div className={`w-[34px] h-[34px] rounded-full ${rec.avatarColor} flex items-center justify-center font-[700] text-[13px] shrink-0`}>
                                                                    {rec.initial}
                                                                </div>
                                                                <span className="font-[600] text-gray-800 whitespace-nowrap">{rec.studentName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-[14px] px-[12px]">
                                                            <span className="px-[8px] py-[3px] bg-gray-100 text-gray-600 rounded-[6px] text-[12px] font-[500]">
                                                                {rec.groupName}
                                                            </span>
                                                        </td>
                                                        <td className="py-[14px] px-[12px] text-gray-500 font-[500]">
                                                            {rec.teacherName}
                                                        </td>
                                                        <td className="py-[14px] px-[12px] text-gray-500 font-[500] whitespace-nowrap">
                                                            {rec.date}
                                                        </td>
                                                        <td className="py-[14px] px-[12px] text-gray-500 font-[500]">
                                                            {rec.time}
                                                        </td>
                                                        <td className="py-[14px] px-[12px] text-center">
                                                            <span className={`inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[8px] text-[12px] font-[700] ${st.bg} ${st.text}`}>
                                                                <i className={`fa-solid ${st.icon} text-[11px]`}></i>
                                                                {st.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Footer count */}
                            {!loading && !error && filtered.length > 0 && (
                                <div className="mt-[20px] flex items-center justify-between text-[13px] text-gray-400 font-[500]">
                                    <span>Jami <strong className="text-gray-700">{filtered.length}</strong> ta yozuv ko'rsatilmoqda</span>
                                    <div className="flex items-center gap-[6px]">
                                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                                            const cnt = filtered.filter(r => r.statusKey === key).length
                                            return cnt > 0 ? (
                                                <span key={key} className={`inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] text-[11px] font-[600] ${cfg.bg} ${cfg.text}`}>
                                                    <span className={`w-[6px] h-[6px] rounded-full ${cfg.dot}`}></span>
                                                    {cfg.label}: {cnt}
                                                </span>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-[32px] right-[32px] z-[999] flex items-center gap-[12px] px-[20px] py-[14px] rounded-[14px] shadow-2xl text-white text-[14px] font-[600] animate-toast-up ${
                    toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-[18px]`}></i>
                    {toast.message}
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes toast-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-toast-up { animation: toast-up 0.3s ease-out; }
            `}} />
        </div>
    )
}
