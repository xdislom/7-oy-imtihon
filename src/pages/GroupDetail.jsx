import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

const findObject = (value) => {
    if (!value || typeof value !== 'object') return {}
    if (value.data && typeof value.data === 'object' && !Array.isArray(value.data)) return value.data
    return value
}

const findArray = (value) => {
    if (Array.isArray(value)) return value
    if (!value || typeof value !== 'object') return []
    if (Array.isArray(value.data)) return value.data
    if (value.data && Array.isArray(value.data.data)) return value.data.data
    if (Array.isArray(value.lessons)) return value.lessons
    if (Array.isArray(value.items)) return value.items
    if (Array.isArray(value.rows)) return value.rows

    for (const key of Object.keys(value)) {
        if (Array.isArray(value[key])) return value[key]
        if (value[key] && typeof value[key] === 'object') {
            const nested = findArray(value[key])
            if (nested.length > 0) return nested
        }
    }

    return []
}

const getName = (value, fallback = "Noma'lum") => {
    if (!value) return fallback
    if (typeof value === 'string') return value
    return value.name || value.title || value.full_name || `${value.first_name || ""} ${value.last_name || ""}`.trim() || fallback
}

const getCount = (value) => {
    if (Array.isArray(value)) return value.length
    if (typeof value === 'number') return value
    return 0
}

const getNumber = (value, fallback = 0) => {
    if (typeof value === 'number') return value
    const parsed = Number(String(value || '').match(/\d+/)?.[0])
    return Number.isNaN(parsed) ? fallback : parsed
}

const formatDays = (value) => {
    if (Array.isArray(value)) return value.join(', ')
    return value || "Noma'lum"
}

const isEmptyValue = (value) => {
    return value === undefined || value === null || value === "" || value === "Noma'lum" || value === "-"
}

const normalizeGroup = (group) => ({
    id: group.id || group._id,
    name: group.name || group.title || "Noma'lum guruh",
    status: group.status === undefined ? "Aktiv" : group.status ? "Aktiv" : "Nofaol",
    course: getName(group.course || group.subject || group.direction, "Noma'lum"),
    duration: group.course?.duration_month || group.durationMonth || group.duration_month || group.duration || group.month || "-",
    room: getName(group.room || group.classroom || group.room_name || group.roomName, "Noma'lum"),
    teachers: Array.isArray(group.teachers) ? group.teachers : group.teacher ? [group.teacher] : group.mentor ? [group.mentor] : [],
    students: Array.isArray(group.students) ? group.students : [],
    studentCount: getCount(group.students || group.student_count || group.students_count),
    maxStudent: group.max_student || group.maxStudent || group.room?.capacity || group.capacity || 0,
    startTime: group.start_time || group.startTime || group.time || group.lesson_time || "Noma'lum",
    startDate: group.start_date || group.startDate || group.begin_date || group.beginDate || group.created_at,
    endDate: group.end_date || group.endDate || group.finish_date || group.finishDate,
    weekDay: formatDays(group.week_day || group.weekDay || group.days || group.lesson_days || group.week_days),
    description: group.description || ""
})

const mergeGroupData = (primary, fallback) => {
    if (!fallback) return primary

    return {
        ...primary,
        name: isEmptyValue(primary.name) ? fallback.name : primary.name,
        course: isEmptyValue(primary.course) ? fallback.course : primary.course,
        duration: isEmptyValue(primary.duration) ? fallback.duration : primary.duration,
        room: isEmptyValue(primary.room) ? fallback.room : primary.room,
        teachers: primary.teachers?.length ? primary.teachers : fallback.teachers?.length ? fallback.teachers : fallback.teacher ? [fallback.teacher] : [],
        studentCount: primary.studentCount || fallback.studentCount || fallback.students || 0,
        maxStudent: primary.maxStudent || fallback.maxStudent || 0,
        startTime: isEmptyValue(primary.startTime) ? fallback.startTime || fallback.time : primary.startTime,
        startDate: primary.startDate || fallback.startDate || fallback.start_date,
        endDate: primary.endDate || fallback.endDate || fallback.end_date,
        weekDay: isEmptyValue(primary.weekDay) ? fallback.weekDay || fallback.days : primary.weekDay
    }
}

const normalizeLessons = (value) => {
    const list = findArray(value)
    if (list.length > 0) return list

    const lesson = findObject(value)
    if (lesson && Object.keys(lesson).length > 0) return [lesson]

    return []
}

const formatDate = (value) => {
    if (!value) return "Noma'lum"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatScheduleRange = (schedule, group) => {
    const start = schedule.start_date || schedule.startDate || schedule.from_date || schedule.fromDate || schedule.start || schedule.group?.start_date || schedule.group?.startDate || group?.startDate
    const end = schedule.end_date || schedule.endDate || schedule.to_date || schedule.toDate || schedule.end || schedule.group?.end_date || schedule.group?.endDate || group?.endDate
    if (!start && !end) return "Noma'lum"
    if (!end) {
        const parsedStart = parseScheduleDate(start)
        const estimatedEnd = parsedStart ? addMonths(parsedStart, getNumber(schedule.group?.course?.duration_month || schedule.course?.duration_month || group?.duration, 1)) : null
        return estimatedEnd ? `${formatDate(start)} - ${formatDate(estimatedEnd)}` : formatDate(start)
    }
    return `${formatDate(start)} - ${formatDate(end)}`
}

const formatScheduleTime = (schedule, group) => {
    const start = schedule.start_time || schedule.startTime || schedule.time || group?.startTime
    const end = schedule.end_time || schedule.endTime || schedule.finish_time || schedule.finishTime
    if (!start && !end) return "Noma'lum"
    if (!end) return start
    return `${start} dan - ${end} gacha`
}

const parseScheduleDate = (value) => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

const toDateKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const addMonths = (date, count) => {
    const nextDate = new Date(date)
    nextDate.setMonth(nextDate.getMonth() + count)
    return nextDate
}

const getScheduleWeekDays = (value) => {
    const source = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,\s/]+/) : []
    const map = {
        SUNDAY: 0, YAKSHANBA: 0, YA: 0,
        MONDAY: 1, DUSHANBA: 1, DU: 1,
        TUESDAY: 2, SESHANBA: 2, SE: 2,
        WEDNESDAY: 3, CHORSHANBA: 3, CHOR: 3, CH: 3,
        THURSDAY: 4, PAYSHANBA: 4, PAY: 4, PA: 4,
        FRIDAY: 5, JUMA: 5, JU: 5,
        SATURDAY: 6, SHANBA: 6, SHA: 6
    }

    return source
        .map(day => map[String(day).trim().toUpperCase()])
        .filter(day => day !== undefined)
}

const getScheduleDatesFromApi = (schedule, group) => {
    if (Array.isArray(schedule.dates)) return schedule.dates
    if (Array.isArray(schedule.lessons)) {
        return schedule.lessons
            .map(lesson => lesson.date || lesson.lesson_date || lesson.lessonDate)
            .filter(Boolean)
    }

    const singleDate = schedule.date || schedule.lesson_date || schedule.lessonDate
    if (singleDate) return [singleDate]

    const start = parseScheduleDate(
        schedule.start_date ||
        schedule.startDate ||
        schedule.from_date ||
        schedule.fromDate ||
        schedule.start ||
        schedule.group?.start_date ||
        schedule.group?.startDate ||
        group?.startDate
    )
    const end = parseScheduleDate(
        schedule.end_date ||
        schedule.endDate ||
        schedule.to_date ||
        schedule.toDate ||
        schedule.end ||
        schedule.group?.end_date ||
        schedule.group?.endDate ||
        group?.endDate
    ) || (start ? addMonths(start, getNumber(schedule.group?.course?.duration_month || schedule.course?.duration_month || group?.duration, 1)) : null)
    if (!start) return []
    if (!end) return [toDateKey(start)]

    const weekDays = getScheduleWeekDays(schedule.week_day || schedule.weekDay || schedule.days || schedule.lesson_days || schedule.week_days || group?.weekDay)
    const dates = []
    const current = new Date(start)

    while (current <= end) {
        if (weekDays.length === 0 || weekDays.includes(current.getDay())) {
            dates.push(toDateKey(current))
        }
        current.setDate(current.getDate() + 1)
    }

    return dates
}

const getAllScheduleDates = (schedules, group) => {
    return [...new Set(schedules.flatMap(schedule => getScheduleDatesFromApi(schedule, group)))]
        .filter(date => parseScheduleDate(date))
        .sort((a, b) => parseScheduleDate(a) - parseScheduleDate(b))
}

const getScheduleMonths = (schedules, group) => {
    const dates = getAllScheduleDates(schedules, group)
    const grouped = dates.reduce((acc, scheduleDate) => {
        const parsed = parseScheduleDate(scheduleDate)
        const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`
        if (!acc[key]) acc[key] = []
        acc[key].push(scheduleDate)
        return acc
    }, {})

    return Object.keys(grouped).map((key, index) => ({
        label: `${index + 1}-o'quv oyi`,
        isCurrent: index === 0,
        dates: grouped[key]
    }))
}

const getScheduleDates = (schedules, group) => {
    return getScheduleMonths(schedules, group)[0]?.dates.slice(0, 13) || []
}

const DateChip = ({ scheduleDate, muted }) => {
    const parsed = new Date(scheduleDate)
    const isValid = !Number.isNaN(parsed.getTime())
    const month = isValid ? parsed.toLocaleDateString('en-US', { month: 'short' }) : ""
    const day = isValid ? parsed.getDate() : scheduleDate

    return (
        <button
            className={`w-[64px] h-[70px] rounded-[10px] border text-center font-[800] flex flex-col items-center justify-center ${muted ? 'bg-slate-200 border-slate-200 text-slate-500' : 'bg-white border-gray-200 text-gray-500'}`}
        >
            <span className="block text-[13px] leading-[18px]">{month}</span>
            <span className="block text-[20px] leading-[24px]">{day}</span>
        </button>
    )
}

export default function GroupDetail() {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [group, setGroup] = useState(null)
    const [schedules, setSchedules] = useState([])
    const [date, setDate] = useState("2026-05-12")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isMentorsOpen, setIsMentorsOpen] = useState(true)
    const [isParamsOpen, setIsParamsOpen] = useState(true)
    const [showAllDates, setShowAllDates] = useState(false)

    const token = localStorage.getItem("token")

    const fetchGroupInfo = async () => {
        if (!token || token === "undefined" || token === "null") {
            navigate("/")
            return
        }

        setLoading(true)
        setError("")

        try {
            const headers = {
                "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
            }

            const [groupResponse, schedulesResponse] = await Promise.all([
                fetch(`${API_URL}/groups/${groupId}`, { headers }),
                fetch(`${API_URL}/groups/${groupId}/schedules`, { headers })
            ])

            const groupData = await groupResponse.json()
            const schedulesData = await schedulesResponse.json()

            if (groupResponse.status === 401 || schedulesResponse.status === 401) {
                localStorage.removeItem("token")
                navigate("/")
                return
            }

            if (!groupResponse.ok) {
                throw new Error(groupData.message || "Guruh ma'lumotlarini olishda xatolik")
            }

            if (!schedulesResponse.ok) {
                throw new Error(schedulesData.message || "Dars jadvalini olishda xatolik")
            }

            const savedGroup = JSON.parse(sessionStorage.getItem("selectedGroup") || "null")
            const fallbackGroup = savedGroup && String(savedGroup.id) === String(groupId) ? normalizeGroup(savedGroup) : null
            setGroup(mergeGroupData(normalizeGroup(findObject(groupData)), fallbackGroup))
            setSchedules(normalizeLessons(schedulesData))
        } catch (error) {
            console.error("Error fetching group detail:", error)
            setError(error.message || "Server bilan bog'lanishda xatolik!")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (location.pathname.startsWith("/dashboard/groups/")) {
            navigate(`/classes/groups/${groupId}`, { replace: true })
            return
        }

        fetchGroupInfo()
    }, [groupId, location.pathname])

    const stats = useMemo(() => {
        const currentGroup = group || {}
        return [
            { label: "Kurs:", value: currentGroup.course || "Noma'lum" },
            { label: "Xona:", value: currentGroup.room || "Noma'lum" },
            { label: "O'quvchilar sig'imi:", value: currentGroup.maxStudent || "-" },
            { label: "Mavjud o'quvchilar:", value: currentGroup.studentCount || 0 },
            { label: "Dars vaqti:", value: currentGroup.startTime || "Noma'lum" },
            { label: "Dars kunlari:", value: currentGroup.weekDay || "Noma'lum" },
            { label: "Kurs davomiyligi (oy):", value: currentGroup.duration || "-" },
            { label: "Jami darslar soni:", value: schedules.length || 0 }
        ]
    }, [group, schedules])

    const mentors = useMemo(() => {
        if (group?.teachers?.length) return [group.teachers[0]]
        return ["Noma'lum"]
    }, [group])

    const scheduleDates = useMemo(() => getScheduleDates(schedules, group), [schedules, group])
    const scheduleMonths = useMemo(() => getScheduleMonths(schedules, group), [schedules, group])

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <div className="flex items-center justify-between mt-[28px] mb-[28px]">
                        <div className="flex items-center gap-[18px]">
                            <button
                                onClick={() => navigate("/classes")}
                                className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px] text-gray-500 hover:bg-white hover:text-purple-600 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <h2 className="text-[28px] font-[800] text-gray-900">{group?.name || "Guruh"}</h2>
                            <span className="px-[12px] py-[5px] rounded-[6px] bg-green-50 border border-green-100 text-green-600 text-[13px] font-[700]">
                                {group?.status || "Aktiv"}
                            </span>
                        </div>

                        <button className="px-[18px] py-[10px] bg-white border border-gray-200 rounded-[8px] text-gray-700 font-[700] flex items-center gap-[10px] hover:border-purple-200">
                            <i className="fa-solid fa-chart-column text-gray-500"></i> Statistika
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-200 mb-[24px]">
                        <div className="flex gap-[28px]">
                            <button className="py-[12px] text-purple-600 font-[800] border-b-[3px] border-purple-600">Ma'lumotlar</button>
                            <button className="py-[12px] text-gray-500 font-[700]">Guruh darsliklari</button>
                            <button className="py-[12px] text-gray-500 font-[700]">Akademik davomati</button>
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mb-[8px] px-[12px] py-[8px] bg-white border border-gray-200 rounded-[8px] outline-none focus:border-purple-400"
                        />
                    </div>

                    {loading && (
                        <div className="bg-white border border-gray-100 rounded-[10px] p-[28px] text-center text-gray-400 font-[700]">
                            Ma'lumotlar yuklanmoqda...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-white border border-red-100 rounded-[10px] p-[28px] text-center text-red-500 font-[700]">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-[0px] items-start mb-[32px]">
                                <div className={`${isMentorsOpen ? 'bg-white' : 'bg-gray-100'} border border-gray-200 xl:rounded-l-[10px] overflow-hidden transition-colors`}>
                                    <button
                                        type="button"
                                        onClick={() => setIsMentorsOpen(!isMentorsOpen)}
                                        className="w-full bg-blue-500 text-white px-[22px] py-[16px] flex items-center justify-between text-left"
                                    >
                                        <h3 className="text-[18px] font-[800]">Guruh mentorlari</h3>
                                        <i className={`fa-solid fa-chevron-${isMentorsOpen ? 'up' : 'down'}`}></i>
                                    </button>
                                    {isMentorsOpen && (
                                        <div className="p-[28px]">
                                            {mentors.map((teacher, index) => (
                                                <div key={index} className="px-[16px] py-[12px] bg-gray-50 border border-gray-100 rounded-[10px] text-gray-900 font-[800]">
                                                    {getName(teacher)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={`${isParamsOpen ? 'bg-white' : 'bg-gray-100'} border border-gray-200 xl:rounded-r-[10px] overflow-hidden transition-colors`}>
                                    <button
                                        type="button"
                                        onClick={() => setIsParamsOpen(!isParamsOpen)}
                                        className="w-full bg-blue-500 text-white px-[22px] py-[16px] flex items-center justify-between text-left"
                                    >
                                        <h3 className="text-[18px] font-[800]">Parametrlar</h3>
                                        <i className={`fa-solid fa-chevron-${isParamsOpen ? 'up' : 'down'}`}></i>
                                    </button>
                                    {isParamsOpen && (
                                        <div className="p-[28px] space-y-[19px]">
                                            {stats.map((item) => (
                                                <div key={item.label} className="flex items-center justify-between gap-[20px]">
                                                    <span className="text-gray-500 font-[600]">{item.label}</span>
                                                    <span className="text-gray-900 font-[800] text-right">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-[14px] px-[32px] py-[34px]">
                                <h3 className="text-[20px] font-[800] text-gray-900 mb-[28px]">Dars jadvali</h3>
                                {schedules.length > 0 ? (
                                    <>
                                        <div className="space-y-[16px]">
                                            {schedules.slice(0, 2).map((schedule, index) => (
                                                <div key={schedule.id || index} className="min-h-[70px] bg-[#f8fafc] border border-[#f1f5f9] rounded-[10px] px-[22px] grid grid-cols-1 md:grid-cols-[1.25fr_1.05fr_1.35fr_1.55fr_1fr] gap-[18px] items-center text-[15px]">
                                                    <span className="text-blue-500 font-[800]">
                                                        {getName(schedule.teacher || schedule.mentor || schedule.teachers?.[0] || group?.teachers?.[0])}
                                                    </span>
                                                    <span className="text-gray-600 font-[700]">
                                                        {formatDays(schedule.week_day || schedule.weekDay || schedule.days || group?.weekDay)}
                                                    </span>
                                                    <span className="text-gray-600 font-[700]">
                                                        {formatScheduleTime(schedule, group)}
                                                    </span>
                                                    <span className="text-gray-600 font-[700]">
                                                        {formatScheduleRange(schedule, group)}
                                                    </span>
                                                    <span className="text-gray-600 font-[700] md:text-right">
                                                        {getName(schedule.room || schedule.classroom, group?.room || "Noma'lum")}
                                                        {schedule.room?.capacity || group?.maxStudent ? ` // ${schedule.room?.capacity || group.maxStudent}` : ""}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {schedules.length > 2 && (
                                            <div className="flex justify-center mt-[30px]">
                                                <button className="px-[22px] py-[10px] border border-gray-200 rounded-[10px] text-gray-500 font-[700] hover:bg-gray-50">
                                                    Yana ko'rsatish ({schedules.length - 2})
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-[44px] flex items-center gap-[16px]">
                                            <button className="w-[38px] h-[38px] rounded-full border border-gray-100 text-gray-300 flex items-center justify-center bg-white">
                                                <i className="fa-solid fa-chevron-left"></i>
                                            </button>
                                            <span className="text-gray-900 font-[800] text-[16px]">1-o'quv oyi</span>
                                            <button className="w-[38px] h-[38px] rounded-full border border-gray-100 text-gray-400 flex items-center justify-center bg-white">
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                        </div>

                                        {!showAllDates ? (
                                            <>
                                                <div className="mt-[26px] flex flex-wrap gap-[10px]">
                                                    {scheduleDates.map((scheduleDate, index) => (
                                                        <DateChip
                                                            key={`${scheduleDate}-${index}`}
                                                            scheduleDate={scheduleDate}
                                                            muted={index < 7}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="flex justify-center mt-[42px]">
                                                    <button
                                                        onClick={() => setShowAllDates(true)}
                                                        className="px-[22px] py-[10px] border border-gray-200 rounded-[10px] text-gray-500 font-[700] hover:bg-gray-50"
                                                    >
                                                        Barchasini ko'rish
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mt-[26px] space-y-[42px]">
                                                {scheduleMonths.map((month) => (
                                                    <div key={month.label}>
                                                        <div className="flex items-center gap-[10px] mb-[20px]">
                                                            <h4 className="text-[18px] font-[800] text-black">{month.label}</h4>
                                                            {month.isCurrent && (
                                                                <span className="px-[10px] py-[4px] rounded-[6px] bg-emerald-50 border border-emerald-200 text-emerald-600 text-[13px] font-[800]">
                                                                    Joriy oy
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-[10px]">
                                                            {month.dates.map((scheduleDate, index) => (
                                                                <DateChip
                                                                    key={`${month.label}-${scheduleDate}`}
                                                                    scheduleDate={scheduleDate}
                                                                    muted={month.isCurrent && index < 7}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => setShowAllDates(false)}
                                                        className="px-[22px] py-[10px] border border-gray-200 rounded-[10px] text-gray-500 font-[700] hover:bg-gray-50"
                                                    >
                                                        Yopish
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="border border-dashed border-gray-200 rounded-[12px] py-[34px] text-center text-gray-400 font-[700]">
                                        Dars jadvali topilmadi
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
