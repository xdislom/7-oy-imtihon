
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import TeacherSidebar from "../components/TeacherSidebar"
import Header from "../components/Header"

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

// Video player: CORS muammosini aylanib o'tish uchun to'g'ridan-to'g'ri video tag ishlatiladi
function VideoPlayer({ url, token, fileId, rawVideoUrl }) {
    const [urlsToTry, setUrlsToTry] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [error, setError] = useState("")
    const [blobUrl, setBlobUrl] = useState("")
    const blobUrlRef = useRef(null)

    useEffect(() => {
        let tryUrls = []
        if (url && url.startsWith("http")) tryUrls.push(url)
        const authToken = (token || '').replace(/^Bearer\s+/i, '').trim()
        
        let fileName = "";
        if (rawVideoUrl) {
            fileName = rawVideoUrl.split("/").pop();
            const d = "https://najot-edu.softwareengineer.uz";
            const normalizedRaw = rawVideoUrl.replace(/^\/+/, "");
            const withoutPublic = normalizedRaw.replace(/^(public\/+)+/, "");

            if (rawVideoUrl.startsWith("http")) {
                tryUrls.push(rawVideoUrl);
            }

            if (rawVideoUrl.startsWith("/public/")) {
                tryUrls.push(`${d}/${withoutPublic}`);
                tryUrls.push(`${d}${rawVideoUrl.replace(/^\/public/, "")}`);
            }

            if (rawVideoUrl.startsWith("/")) {
                tryUrls.push(`${d}${rawVideoUrl}`);
            } else if (!rawVideoUrl.startsWith("http")) {
                tryUrls.push(`${d}/${normalizedRaw}`);
            }

            if (withoutPublic && withoutPublic !== normalizedRaw) {
                tryUrls.push(`${d}/${withoutPublic}`);
            }

            tryUrls.push(`${d}/assets/${fileName}`);
            tryUrls.push(`${d}/uploads/${fileName}`);
            tryUrls.push(`${d}/api/v1/uploads/${fileName}`);
            tryUrls.push(`${d}/files/${fileName}`);
            tryUrls.push(`${d}/api/v1/files/${fileName}`);
        }

        if (fileId) {
            // Use direct download endpoints instead of stream
            tryUrls.push(`${API_URL}/files/download/${fileId}`)
            tryUrls.push(`${API_URL}/files/${fileId}`)
            // If we have an auth token, also try passing it as a query parameter (some backends accept this)
            if (authToken) {
                tryUrls.push(`${API_URL}/files/download/${fileId}?token=${encodeURIComponent(authToken)}`)
                tryUrls.push(`${API_URL}/files/${fileId}?token=${encodeURIComponent(authToken)}`)
            }
        }

        const uniqueUrls = [...new Set(tryUrls)]
        setUrlsToTry(uniqueUrls)
        setCurrentIndex(0)
        setError("")
        console.log('VideoPlayer: candidate URLs', uniqueUrls)
    }, [url, fileId, rawVideoUrl])

    useEffect(() => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
            blobUrlRef.current = null
        }

        const currentUrl = urlsToTry[currentIndex]
        if (!currentUrl) {
            setBlobUrl("")
            return
        }

        const shouldFetchWithAuth = token && currentUrl.startsWith(API_URL)
        if (!shouldFetchWithAuth) {
            setBlobUrl("")
            return
        }

        const controller = new AbortController()
        const authToken = (token || '').replace(/^Bearer\s+/i, '').trim()
        console.log('VideoPlayer: attempting authenticated fetch', currentUrl)
        fetch(currentUrl, {
            headers: { Authorization: `Bearer ${authToken}` },
            signal: controller.signal
        })
            .then((res) => {
                console.log('VideoPlayer: fetch response', currentUrl, res.status, res.headers.get('content-type'))
                if (!res.ok) throw new Error(`Video fetch failed ${res.status}`)
                return res.blob()
            })
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob)
                blobUrlRef.current = objectUrl
                setBlobUrl(objectUrl)
                console.log('VideoPlayer: created blob URL', objectUrl)
            })
            .catch((err) => {
                console.error("Video authenticated fetch failed:", err, currentUrl)
                if (currentIndex < urlsToTry.length - 1) {
                    setCurrentIndex((prev) => prev + 1)
                } else {
                    setError("Video topilmadi yoki serverdan kelmayapti.")
                }
            })

        return () => {
            controller.abort()
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current)
                blobUrlRef.current = null
            }
        }
    }, [urlsToTry, currentIndex, token])

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-[16px] text-center w-full h-full px-[24px]">
                <i className="fa-regular fa-circle-play text-white text-[64px] opacity-30"></i>
                <p className="text-red-400 text-[14px] font-[500]">{error}</p>
            </div>
        )
    }

    if (urlsToTry.length === 0) return null;

    const currentUrl = urlsToTry[currentIndex];
    const isAuthUrl = token && currentUrl && currentUrl.startsWith(API_URL);
    const videoSrc = isAuthUrl ? blobUrl : currentUrl;

    return (
        <div className="w-full h-full relative group">
            {isAuthUrl && !blobUrl ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-white gap-3">
                    <i className="fa-solid fa-spinner fa-spin text-[32px]"></i>
                    <p className="text-[13px] text-gray-300">Video manzili tekshirilmoqda...</p>
                </div>
            ) : (
                <video
                    key={videoSrc || currentUrl}
                    src={videoSrc}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    onError={() => {
                        console.error("Video yuklanmadi:", currentUrl);
                        if (currentIndex < urlsToTry.length - 1) {
                            setCurrentIndex(prev => prev + 1);
                        } else {
                            setError("Video topilmadi yoki serverdan kelmayapti.");
                        }
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            )}
            
            {/* Faqat qidirish jarayonida manzilni ko'rsatamiz */}
            {currentIndex < urlsToTry.length - 1 && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                    Qidirilmoqda ({currentIndex + 1}/{urlsToTry.length}): {currentUrl}
                </div>
            )}
        </div>
    )
}


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
    startDate: group.start_date || group.startDate || group.begin_date || group.beginDate || group.created_at || group.createdAt || group.opened_date || group.openedDate || new Date().toISOString(),
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

const formatDateTime = (value) => {
    if (!value) return "Noma'lum"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month}, ${year} ${hours}:${minutes}`
}

const formatDateOnly = (value) => {
    if (!value) return "Noma'lum"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
}

const formatScheduleRange = (schedule, group) => {
    const start = schedule.start_date || schedule.startDate || schedule.from_date || schedule.fromDate || schedule.start || schedule.group?.start_date || schedule.group?.startDate || group?.startDate || group?.start_date || group?.created_at || group?.createdAt || new Date().toISOString()
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
        group?.startDate ||
        group?.start_date ||
        group?.created_at ||
        group?.createdAt ||
        new Date().toISOString()
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

    const today = new Date()
    const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    const keys = Object.keys(grouped)
    const hasCurrentMonth = keys.includes(currentMonthKey)

    return keys.map((key, index) => ({
        label: `${index + 1}-o'quv oyi`,
        isCurrent: hasCurrentMonth ? key === currentMonthKey : index === 0,
        dates: grouped[key]
    }))
}

const getScheduleDates = (schedules, group) => {
    return getScheduleMonths(schedules, group)[0]?.dates.slice(0, 13) || []
}

const DateChip = ({ scheduleDate, onClick, isSelected }) => {
    const parsed = new Date(scheduleDate)
    const isValid = !Number.isNaN(parsed.getTime())
    const month = isValid ? parsed.toLocaleDateString('en-US', { month: 'short' }) : ""
    const day = isValid ? parsed.getDate() : scheduleDate

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    parsed.setHours(0, 0, 0, 0)

    const isPast = isValid && parsed < today
    const isToday = isValid && parsed.getTime() === today.getTime()
    const isFuture = isValid && parsed > today

    let chipClass = ''
    let labelClass = ''
    let dayClass = ''
    let cursor = 'cursor-default'

    if (isSelected && isToday) {
        chipClass = 'bg-[#00b87c] border-[#00b87c] shadow-lg ring-2 ring-[#00b87c]/30'
        labelClass = 'text-white opacity-80'
        dayClass = 'text-white'
        cursor = 'cursor-pointer'
    } else if (isToday) {
        chipClass = 'bg-[#00b87c] border-[#00b87c] shadow-md'
        labelClass = 'text-white opacity-80'
        dayClass = 'text-white'
        cursor = 'cursor-pointer'
    } else if (isSelected && isPast) {
        chipClass = 'bg-[#475569] border-[#475569] shadow-lg ring-2 ring-[#475569]/30'
        labelClass = 'text-white'
        dayClass = 'text-white'
        cursor = 'cursor-pointer'
    } else if (isPast) {
        chipClass = 'bg-[#b0b8c1] border-[#b0b8c1] opacity-70 hover:opacity-100 hover:bg-[#8a95a0] hover:border-[#8a95a0]'
        labelClass = 'text-[#5a6370]'
        dayClass = 'text-[#3d4550]'
        cursor = 'cursor-pointer'
    } else {
        // future
        chipClass = 'bg-white border-gray-200 opacity-60'
        labelClass = 'text-gray-400'
        dayClass = 'text-gray-400'
        cursor = 'cursor-not-allowed'
    }

    return (
        <button
            onClick={!isFuture ? onClick : undefined}
            disabled={isFuture}
            className={`w-[64px] h-[70px] rounded-[10px] border text-center font-[800] flex flex-col items-center justify-center transition-all ${chipClass} ${cursor}`}
        >
            <span className={`block text-[13px] leading-[18px] ${labelClass}`}>{month}</span>
            <span className={`block text-[20px] leading-[24px] ${dayClass}`}>{day}</span>
        </button>
    )
}

export default function GroupDetail() {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const roleStr = String(localStorage.getItem("role") || "").toLowerCase();
    const isTeacher = roleStr.includes("teacher") || roleStr.includes("mentor") || roleStr.includes("o'qituvchi");

    const [group, setGroup] = useState(null)
    const [schedules, setSchedules] = useState([])
    const [lessons, setLessons] = useState([])
    const [homeworkLoading, setHomeworkLoading] = useState(false)
    const [date, setDate] = useState("2026-05-12")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isParamsOpen, setIsParamsOpen] = useState(true)
    const [isMentorsOpen, setIsMentorsOpen] = useState(true)
    const [showAllDates, setShowAllDates] = useState(false)
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
    const [activeTab, setActiveTab] = useState("info")
    const [activeLessonsTab, setActiveLessonsTab] = useState("homework")
    const [isMentorsModalOpen, setIsMentorsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [lessonType, setLessonType] = useState("boshqa")
    const [mavzu, setMavzu] = useState("")
    const [tavsif, setTavsif] = useState("")
    const [groupStudents, setGroupStudents] = useState([])
    const [groupStudentsCount, setGroupStudentsCount] = useState(0)
    const [taughtDates, setTaughtDates] = useState(() => JSON.parse(localStorage.getItem(`taughtDates_${groupId}`) || '{}'))
    const [studentsLoading, setStudentsLoading] = useState(false)
    const [attendance, setAttendance] = useState({})
    const [attendanceSaving, setAttendanceSaving] = useState(false)
    const [attendanceMessage, setAttendanceMessage] = useState("")
    const [attendanceError, setAttendanceError] = useState(false)
    const [toast, setToast] = useState(null)
    const [videos, setVideos] = useState(() => JSON.parse(localStorage.getItem(`mockVideos_${groupId}`) || '[]'))
    const [videosLoading, setVideosLoading] = useState(false)
    const [videosError, setVideosError] = useState("")
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
    const [videoFile, setVideoFile] = useState(null)
    const [videoDragOver, setVideoDragOver] = useState(false)
    const [selectedVideoLessonId, setSelectedVideoLessonId] = useState("")
    const [videoNameInput, setVideoNameInput] = useState("")
    const [generalLessons, setGeneralLessons] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [selectedVideoPlayer, setSelectedVideoPlayer] = useState(null)
    const [openVideoMenuId, setOpenVideoMenuId] = useState(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState(null)
    const [mockVideos, setMockVideos] = useState(() => JSON.parse(localStorage.getItem(`mockVideos_${groupId}`) || '[]'))

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const getSavedAttendance = (date) => {
        if (!date) return {}
        const saved = JSON.parse(localStorage.getItem(`attendance_${groupId}`) || '{}')
        return saved[date] || {}
    }

    const saveAttendanceForDate = (date, attendanceData) => {
        if (!date) return
        const saved = JSON.parse(localStorage.getItem(`attendance_${groupId}`) || '{}')
        saved[date] = attendanceData
        localStorage.setItem(`attendance_${groupId}`, JSON.stringify(saved))
    }

    const handleVideoUpload = async () => {
        if (!videoFile) return;
        if (!selectedVideoLessonId) {
            alert("Iltimos, video qaysi darsga tegishli ekanligini tanlang!");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", videoFile);
            // formData.append("name", videoNameInput); // Agar API da video nomi ham kerak bo'lsa

            const tok = (token || '').replace(/^Bearer\s+/i, '').trim();
            const uploadUrl = `${API_URL}/files/group/${groupId}/upload?lessonId=${selectedVideoLessonId}`;
            console.log("Video upload URL:", uploadUrl);
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tok}`
                },
                body: formData
            });

            if (response.ok) {
                await fetchVideos(); // Videolarni qayta yuklash
                setIsVideoModalOpen(false);
                setVideoFile(null);
                setSelectedVideoLessonId("");
                setVideoNameInput("");
            } else {
                const errData = await response.json().catch(() => ({}));
                alert(errData.message || "Video yuklashda xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Video upload error:", error);
            alert("Server bilan aloqada xatolik yuz berdi!");
        } finally {
            setIsUploading(false);
        }
    }

    const handleDeleteVideo = (fileId) => {
        setOpenVideoMenuId(null);
        setDeleteConfirmId(fileId);
    }

    const confirmDeleteVideo = () => {
        const fileId = deleteConfirmId;
        const updatedVideos = videos.filter(v => (v.id || v._id) !== fileId);
        setVideos(updatedVideos);
        const updatedMockVideos = mockVideos.filter(v => v.id !== fileId);
        setMockVideos(updatedMockVideos);
        localStorage.setItem(`mockVideos_${groupId}`, JSON.stringify(updatedMockVideos));
        setDeleteConfirmId(null);
    }

    const handleSaveAttendance = async () => {
        if (!selectedDate) return;
        setAttendanceMessage("")
        setAttendanceError(false)

        if (!mavzu.trim()) {
            setAttendanceMessage("Iltimos, dars mavzusini kiriting!")
            setAttendanceError(true)
            return;
        }

        setAttendanceSaving(true)
        try {
            const tok = (token || '').replace(/^Bearer\s+/i, '').trim()
            const headers = {
                'Authorization': `Bearer ${tok}`,
                'Content-Type': 'application/json'
            }

            // API ga dars va yo'qlamani bitta qilib yuborish
            const attendancesList = groupStudents.map(student => ({
                student_id: student.id,
                isPresent: attendance[student.id] ? "true" : "false"
            }));

            try {
                // API ga yangi marshrut bo'yicha yuborish: /groups/:groupId/lesson
                const saveRes = await fetch(`${API_URL}/groups/${groupId}/lesson`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        topic: mavzu.trim(),
                        date: selectedDate, // lesson_date o'rniga date yoki date_of_lesson bo'lishi ham mumkin
                        lesson_date: selectedDate,
                        description: tavsif.trim(),
                        type: lessonType, // O'quv reja yoki boshqa
                        attendances: attendancesList
                    })
                });
                
                if (!saveRes.ok) {
                    const errText = await saveRes.text();
                    console.warn("Dars va yo'qlama saqlashda xatolik:", errText);
                    setAttendanceMessage(`Xatolik: ${errText}`);
                    setAttendanceError(true);
                    setAttendanceSaving(false);
                    return; // Xato bo'lsa davom ettirmaslik
                }
            } catch (err) {
                console.error("Attendance save error:", err);
                throw err;
            }

            const newTaughtDates = { ...taughtDates, [selectedDate]: true };
            setTaughtDates(newTaughtDates);
            localStorage.setItem(`taughtDates_${groupId}`, JSON.stringify(newTaughtDates));
            saveAttendanceForDate(selectedDate, attendance)
            showToast("success", "Davomat muvaffaqiyatli saqlandi! ✓")
            fetchGeneralLessons() // Darslar ro'yxatini yangilash
        } catch (err) {
            console.error('Attendance save error:', err)
            showToast("error", "Davomat saqlanmadi")
        } finally {
            setAttendanceSaving(false)
        }
    }

    const token = localStorage.getItem("token")

    const mockLessons = [
        {
            id: 1,
            title: "Html asoslari",
            created_at: "2026-05-13T10:00:00",
            end_date: "2026-05-14T06:00:00",
            lesson_date: "2026-05-12T00:00:00",
            submitted: 5,
            late: 0,
            completed: 0
        },
        {
            id: 2,
            title: "Kirish",
            created_at: "2026-05-13T11:52:00",
            end_date: "2026-05-14T07:52:00",
            lesson_date: "2026-05-09T00:00:00",
            submitted: 5,
            late: 0,
            completed: 0
        },
        {
            id: 3,
            title: "Nodejs",
            created_at: "2026-05-14T09:47:00",
            end_date: "2026-05-15T05:47:00",
            lesson_date: "2026-05-14T00:00:00",
            submitted: 5,
            late: 0,
            completed: 3
        },
        {
            id: 4,
            title: "takroriyash",
            created_at: "2026-05-19T16:22:00",
            end_date: "2026-05-20T12:22:00",
            lesson_date: "2026-05-19T00:00:00",
            submitted: 5,
            late: 0,
            completed: 0
        }
    ]

    const mockTeachers = [
        { id: 1, name: "Ahmadjon Rixsiboyev", role: "Teacher" },
        { id: 2, name: "Ali", role: "Teacher" },
        { id: 3, name: "Primov Shoxzod", role: "Teacher" },
        { id: 4, name: "Axmadjon", role: "Teacher" }
    ]

    // API dan tanlangan sana uchun davomat holatini yuklash
    const fetchAttendanceFromApi = async (date, students) => {
        const tok = (token || '').replace(/^Bearer\s+/i, '').trim()
        if (!tok || !date || !students.length) return
        try {
            // Yangi dars va yo'qlama endpointi: /groups/:groupId/lesson?date=YYYY-MM-DD
            const res = await fetch(`${API_URL}/groups/${groupId}/lesson?date=${date}`, {
                headers: { 'Authorization': `Bearer ${tok}` }
            })
            const init = {}
            students.forEach(s => { init[s.id] = false })

            if (!res.ok) {
                const saved = getSavedAttendance(date)
                setAttendance(Object.keys(saved).length ? { ...init, ...saved } : init)
                setMavzu("")
                setTavsif("")
                return
            }

            const data = await res.json()
            console.log("LESSON API RESPONSE:", data)
            let lesson = data.data || data
            if (Array.isArray(lesson)) lesson = lesson[0]
            if (lesson?.data && Array.isArray(lesson.data)) lesson = lesson.data[0]

            // Agar dars (lesson) kelsa:
            if (lesson && typeof lesson === 'object' && Object.keys(lesson).length > 0) {
                setMavzu(lesson.topic || lesson.name || lesson.title || "")
                setTavsif(lesson.description || lesson.tavsif || "")
                if (lesson.type) setLessonType(lesson.type)

                // Yo'qlamalarni tiklash
                let attList = lesson.attendances || lesson.attendance || []
                if (typeof attList === 'string') {
                    try { attList = JSON.parse(attList) } catch(e){}
                }
                if (Array.isArray(attList)) {
                    attList.forEach(rec => {
                        const sid = String(rec.student_id || rec.student?.id || '')
                        if (sid) {
                            const isPresent = rec.isPresent !== undefined ? (rec.isPresent === "true" || rec.isPresent === true) 
                                : rec.is_present !== undefined ? !!rec.is_present
                                : rec.present !== undefined ? !!rec.present
                                : String(rec.status || '').toLowerCase() === 'present'
                            init[sid] = isPresent
                        }
                    })
                }
                setAttendance({ ...init })
                
                // Dars o'tilganini (qulflanganini) belgilaymiz
                setTaughtDates(prev => {
                    const updated = { ...prev, [date]: true }
                    localStorage.setItem(`taughtDates_${groupId}`, JSON.stringify(updated))
                    return updated
                })
            } else {
                // Bu sana uchun API da ma'lumot yo'q – localStorage fallback
                const saved = getSavedAttendance(date)
                setAttendance(Object.keys(saved).length ? { ...init, ...saved } : init)
                setMavzu("")
                setTavsif("")
            }
        } catch (err) {
            console.warn('fetchAttendanceFromApi error:', err)
            const saved = getSavedAttendance(date)
            const init = {}
            students.forEach(s => { init[s.id] = false })
            setAttendance(Object.keys(saved).length ? { ...init, ...saved } : init)
            setMavzu("")
            setTavsif("")
        }
    }

    const fetchGroupStudents = async () => {
        if (!token || token === "undefined" || token === "null") return
        setStudentsLoading(true)
        try {
            // Avval guruh talabalarini to'g'ridan olishga urinib ko'ramiz
            const headers = { "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}` }
            const res = await fetch(`${API_URL}/groups/one/students/${groupId}`, { headers })
            if (res.ok) {
                const data = await res.json()
                const list = findArray(data)
                // Filterlash kerak emas, endpoint o'zi shu guruhnikini qaytaradi deb hisoblaymiz
                // Yoki baribir filter qoldirish zarar qilmaydi, lekin list yetarli
                const filtered = list;
                const normalized = (filtered.length > 0 ? filtered : list).map((s, idx) => ({
                    id: s.id || s._id || idx + 1,
                    name: s.full_name || s.name || "Noma'lum",
                    initial: (s.full_name || s.name || 'S').charAt(0).toUpperCase(),
                    avatar: s.avatar || s.photo || null
                }))
                setGroupStudents(normalized)
                // Davomat holatini API dan yuklash (localStorage fallback bilan)
                const initEmpty = {}
                normalized.forEach(s => { initEmpty[s.id] = false })
                setAttendance(initEmpty)
                fetchAttendanceFromApi(selectedDate, normalized)
            }
        } catch (err) {
            console.error('Students fetch error:', err)
        } finally {
            setStudentsLoading(false)
        }
    }

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

            let finalGroupData = null;
            if (!groupResponse.ok) {
                if (isTeacher) {
                    const savedGroup = JSON.parse(sessionStorage.getItem("selectedGroup") || "null")
                    if (savedGroup && String(savedGroup.id) === String(groupId)) {
                        finalGroupData = normalizeGroup(savedGroup)
                    } else {
                        throw new Error(groupData.message || "Guruh ma'lumotlarini olishda xatolik")
                    }
                } else {
                    throw new Error(groupData.message || "Guruh ma'lumotlarini olishda xatolik")
                }
            } else {
                const apiGroup = normalizeGroup(findObject(groupData));
                const savedGroup = JSON.parse(sessionStorage.getItem("selectedGroup") || "null")
                const fallbackGroup = savedGroup && String(savedGroup.id) === String(groupId) ? normalizeGroup(savedGroup) : null
                finalGroupData = mergeGroupData(apiGroup, fallbackGroup)
            }

            let finalSchedules = [];
            if (!schedulesResponse.ok) {
                if (!isTeacher) {
                    throw new Error(schedulesData.message || "Dars jadvalini olishda xatolik")
                }
            } else {
                finalSchedules = normalizeLessons(schedulesData)
            }

            setGroup(finalGroupData)
            setSchedules(finalSchedules)

            // Homework ma'lumotlarini alohida yuklash
            fetchHomework(headers)
        } catch (error) {
            console.error("Error fetching group detail:", error)
            setError(error.message || "Server bilan bog'lanishda xatolik!")
        } finally {
            setLoading(false)
        }
    }

    const fetchHomework = async (existingHeaders) => {
        const headers = existingHeaders || {
            "Authorization": `Bearer ${(token || '').replace(/^Bearer\s+/i, '')}`
        }
        setHomeworkLoading(true)
        try {
            const res = await fetch(`${API_URL}/homework/${groupId}`, { headers })
            if (res.ok) {
                const data = await res.json()
                // Endpoint guruhga tegishli vazifalarni qaytaradi, shuning uchun to'g'ridan-to'g'ri olamiz
                const groupHomeworks = findArray(data)
                console.log("✅ Homework:", groupHomeworks.length, "ta topildi")
                if (groupHomeworks.length > 0) console.log("📦 Birinchi homework fieldi:", JSON.stringify(groupHomeworks[0]))
                
                // Har bir uyga vazifa uchun ACCEPTED va PENDING sonlarini API dan olamiz
                const enriched = await Promise.all(groupHomeworks.map(async (hw) => {
                    try {
                        const actualHwId = Array.isArray(hw.homework) && hw.homework.length > 0 ? hw.homework[0].id : (hw.homework?.id || hw.homeworkId || hw.id);
                        const [pendingRes, acceptedRes] = await Promise.all([
                            fetch(`${API_URL}/group/${groupId}/homework/${actualHwId}/results?status=PENDING`, { headers }),
                            fetch(`${API_URL}/group/${groupId}/homework/${actualHwId}/results?status=ACCEPTED`, { headers }),
                        ])
                        const pendingData = pendingRes.ok ? await pendingRes.json() : {}
                        const acceptedData = acceptedRes.ok ? await acceptedRes.json() : {}
                        
                        const getCount = (d) => {
                            if (Array.isArray(d)) return d.length
                            if (Array.isArray(d?.data?.students)) return d.data.students.length
                            if (Array.isArray(d?.data)) return d.data.length
                            if (Array.isArray(d?.students)) return d.students.length
                            if (Array.isArray(d?.data?.data)) return d.data.data.length
                            return 0
                        }
                        
                        return {
                            ...hw,
                            pending_count: getCount(pendingData),
                            completed_count: getCount(acceptedData),
                        }
                    } catch {
                        return hw
                    }
                }))
                
                setLessons(enriched)
            } else if (res.status === 401) {
                localStorage.removeItem("token")
                navigate("/")
            } else {
                console.error("Homework fetch failed with status:", res.status)
                setLessons([])
            }

            // O'quvchilar sonini /groups/one/students/:groupId dan olamiz (yangi API)
            try {
                const studRes = await fetch(`${API_URL}/groups/one/students/${groupId}`, { headers })
                if (studRes.ok) {
                    const studData = await studRes.json()
                    const studList = findArray(studData)
                    console.log("👥 Haqiqiy o'quvchilar soni (yangi API):", studList.length)
                    setGroupStudentsCount(studList.length)
                }
            } catch (e) {
                console.error("Students count fetch error:", e)
            }
        } catch (err) {
            console.error("Homework fetch network error:", err)
            setLessons([])
        } finally {
            setHomeworkLoading(false)
        }
    }

    const fetchGeneralLessons = async () => {
        const tok = (token || '').replace(/^Bearer\s+/i, '').trim()
        if (!tok) return
        try {
            const headers = { "Authorization": `Bearer ${tok}` }
            const res = await fetch(`${API_URL}/lessons/my/group/${groupId}`, { headers })
            if (res.ok) {
                const data = await res.json()
                console.log("Darslar API javobi:", data);
                const list = findArray(data)
                console.log("Topilgan darslar ro'yxati:", list);
                setGeneralLessons(list)
            } else {
                console.error("Darslarni olishda xatolik:", res.status, await res.text());
            }
        } catch (err) {
            console.error("General lessons fetch error:", err)
        }
    }

    const fetchVideos = async () => {
        setVideosLoading(true)
        setVideosError("")
        try {
            const savedMocks = JSON.parse(localStorage.getItem(`mockVideos_${groupId}`) || '[]') || [];
            let merged = [...savedMocks]

            const tok = (token || '').replace(/^Bearer\s+/i, '').trim()
            if (tok) {
                const headers = { "Authorization": `Bearer ${tok}` }
                const endpoints = [
                    `${API_URL}/files/group/${groupId}`,
                    `${API_URL}/groups/${groupId}/files`,
                    `${API_URL}/files?groupId=${groupId}`,
                    `${API_URL}/files/${groupId}`,
                    'https://najot-edu.softwareengineer.uz/api/v1/files/45'
                ]

                for (const endpoint of endpoints) {
                    try {
                        const res = await fetch(endpoint, { headers })
                        if (!res.ok) {
                            console.warn(`Video fetch failed: ${endpoint} -> ${res.status}`)
                            continue
                        }

                        const data = await res.json()
                        const arr = findArray(data)
                        if (arr && arr.length > 0) {
                            merged = [...merged, ...arr]
                            break
                        }

                        const obj = findObject(data)
                        if (obj && Object.keys(obj).length > 0) {
                            merged.push(obj)
                            break
                        }
                    } catch (e) {
                        console.warn(`Video fetch failed for ${endpoint}:`, e)
                    }
                }
            }

            setVideos(merged)
            setVideosError("")
        } catch (err) {
            console.error("Videos fetch error:", err)
            const savedMocks = JSON.parse(localStorage.getItem(`mockVideos_${groupId}`) || '[]') || [];
            setVideos(savedMocks);
            setVideosError("")
        } finally {
            setVideosLoading(false)
        }
    }

    useEffect(() => {
        if (selectedDate) {
            fetchGroupStudents()
        }
    }, [selectedDate, generalLessons, lessons, schedules])

    useEffect(() => {
        if (isVideoModalOpen && generalLessons.length === 0) {
            fetchGeneralLessons()
        }
    }, [isVideoModalOpen, generalLessons.length])

    useEffect(() => {
        if (activeLessonsTab === "videos" && activeTab === "lessons") {
            fetchVideos()
        }
    }, [activeLessonsTab, activeTab])

    useEffect(() => {
        if (location.pathname.startsWith("/dashboard/groups/") && !isTeacher) {
            navigate(`/classes/groups/${groupId}`, { replace: true })
            return
        }

        fetchGroupInfo()
        // Reset videos to localStorage data for this specific group when switching groups
        const saved = JSON.parse(localStorage.getItem(`mockVideos_${groupId}`) || '[]')
        setVideos(saved)
        setVideosError("")
        setMockVideos(saved)
        // ensure any previously opened video modal is closed when switching groups
        setSelectedVideoPlayer(null)
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
        if (group?.teachers?.length) {
            return group.teachers.slice(0, 4).map(teacher => ({
                name: getName(teacher),
                full_name: teacher.full_name || teacher.name,
                avatar: teacher.avatar || teacher.photo,
                role: "Teacher",
                ...teacher
            }))
        }
        return mockTeachers.slice(0, 4)
    }, [group])

    const scheduleMonths = useMemo(() => getScheduleMonths(schedules, group), [schedules, group])

    useEffect(() => {
        if (scheduleMonths.length > 0) {
            const idx = scheduleMonths.findIndex(m => m.isCurrent);
            setCurrentMonthIndex(idx !== -1 ? idx : 0);
        }
    }, [scheduleMonths])

    console.log(group)

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="flex">
                {isTeacher ? (
                    <TeacherSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                ) : (
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                )}
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <div className="flex items-center justify-between mt-[28px] mb-[28px]">
                        <div className="flex items-center gap-[18px]">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px] text-gray-500 hover:bg-white hover:text-purple-600 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <h2 className="text-[28px] font-[800] text-gray-900">{group?.course || "Guruh"}</h2>
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
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`py-[12px] font-[800] border-b-[3px] transition-colors ${activeTab === "info" ? 'text-[#00b87c] border-[#00b87c]' : 'text-gray-500 border-transparent'}`}
                            >
                                Ma'lumotlar
                            </button>
                            <button
                                onClick={() => setActiveTab("lessons")}
                                className={`py-[12px] font-[800] border-b-[3px] transition-colors ${activeTab === "lessons" ? 'text-[#00b87c] border-[#00b87c]' : 'text-gray-500 border-transparent'}`}
                            >
                                Guruh darsliklari
                            </button>
                            <button
                                onClick={() => setActiveTab("attendance")}
                                className={`py-[12px] font-[800] border-b-[3px] transition-colors ${activeTab === "attendance" ? 'text-[#00b87c] border-[#00b87c]' : 'text-gray-500 border-transparent'}`}
                            >
                                Akademik davomati
                            </button>
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

                    {!loading && !error && activeTab === "info" && (
                        <>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-[0px] items-stretch mb-[32px]">
                                <div className={`${isMentorsOpen ? 'bg-white' : 'bg-gray-100'} border border-gray-200 xl:rounded-l-[10px] overflow-hidden transition-colors h-full`}>
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
                                            <div className="grid gap-[18px] md:grid-cols-2">
                                                {mentors.map((teacher, index) => (
                                                    <div key={index} className="flex flex-col items-center gap-[6px] p-[14px] rounded-[18px] border border-gray-100 shadow-sm bg-white text-center">
                                                        <div className="w-[64px] h-[64px] rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-[700] text-[24px] overflow-hidden">
                                                            {teacher?.avatar ? (
                                                                <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span>{(teacher.name || teacher.full_name || 'T')[0]}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-[700] text-[#00b87c] uppercase tracking-[0.08em]">Teacher</p>
                                                        <p className="text-[14px] font-[800] text-gray-900 truncate">{teacher.name || teacher.full_name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={`${isParamsOpen ? 'bg-white' : 'bg-gray-100'} border border-gray-200 xl:rounded-r-[10px] overflow-hidden transition-colors h-full`}>
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
                                            <button 
                                                onClick={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
                                                disabled={currentMonthIndex === 0}
                                                className={`w-[38px] h-[38px] rounded-full border border-gray-100 flex items-center justify-center bg-white ${currentMonthIndex === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-50'}`}>
                                                <i className="fa-solid fa-chevron-left"></i>
                                            </button>
                                            <span className="text-gray-900 font-[800] text-[16px]">{scheduleMonths[currentMonthIndex]?.label || "1-o'quv oyi"}</span>
                                            <button 
                                                onClick={() => setCurrentMonthIndex(prev => Math.min(scheduleMonths.length - 1, prev + 1))}
                                                disabled={scheduleMonths.length === 0 || currentMonthIndex === scheduleMonths.length - 1}
                                                className={`w-[38px] h-[38px] rounded-full border border-gray-100 flex items-center justify-center bg-white ${scheduleMonths.length === 0 || currentMonthIndex === scheduleMonths.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-50'}`}>
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                        </div>

                                        {!showAllDates ? (
                                            <>
                                                <div className="mt-[26px] flex flex-wrap gap-[10px]">
                                                    {(scheduleMonths[currentMonthIndex]?.dates.slice(0, 13) || []).map((scheduleDate, index) => (
                                                        <DateChip
                                                            key={`${scheduleDate}-${index}`}
                                                            scheduleDate={scheduleDate}
                                                            isSelected={selectedDate === scheduleDate}
                                                            onClick={() => {
                                                                setSelectedDate(prev => prev === scheduleDate ? null : scheduleDate)
                                                            }}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Tanlangan sana uchun Ma'lumot paneli */}
                                                {selectedDate && (() => {
                                                    const todayObj = new Date();
                                                    todayObj.setHours(0, 0, 0, 0);
                                                    const selectedDateObj = new Date(selectedDate);
                                                    const isPastDate = selectedDateObj < todayObj;
                                                    const isTaught = isPastDate || taughtDates[selectedDate];

                                                    return (
                                                    <div className="mt-[28px] space-y-[16px] animate-fade-in">
                                                        {/* Ma'lumot kartasi */}
                                                        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
                                                            <div className="flex items-center justify-between px-[22px] py-[16px] border-b border-gray-100">
                                                                <h4 className="text-[16px] font-[800] text-gray-900">Ma'lumot</h4>
                                                                <i className="fa-solid fa-chevron-right text-gray-400 text-[13px]"></i>
                                                            </div>
                                                            <div className="px-[22px] py-[20px] flex items-center gap-[16px]">
                                                                <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-[700] text-[18px] flex-shrink-0">
                                                                    {(mentors[0]?.name?.charAt(0) || 'M')}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-[15px] font-[800] text-gray-900">{mentors[0]?.name || "Mohirbek"}</p>
                                                                    <p className="text-[13px] text-gray-400 font-[500]">Teacher</p>
                                                                </div>
                                                                <div className="flex gap-[32px]">
                                                                    <div>
                                                                        <p className="text-[12px] text-gray-400 font-[500] mb-[2px]">Dars kuni</p>
                                                                        <p className="text-[14px] font-[700] text-gray-800">
                                                                            {new Date(selectedDate).toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[12px] text-gray-400 font-[500] mb-[2px]">Holat</p>
                                                                        <p className={`text-[14px] font-[700] ${isTaught ? 'text-[#00b87c]' : 'text-blue-500'}`}>{isTaught ? "Dars o'tilgan" : "Dars o'tilmagan"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Yo'qlama va mavzu kiritish */}
                                                        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
                                                            <div className="px-[22px] py-[16px] border-b border-gray-100">
                                                                <h4 className="text-[16px] font-[800] text-gray-900">Yo'qlama va mavzu kiritish</h4>
                                                            </div>
                                                            <div className="px-[22px] py-[20px] space-y-[20px]">
                                                                {/* Radio tugmalar */}
                                                                <div className="flex items-center gap-[24px]">
                                                                    <label className="flex items-center gap-[8px] cursor-pointer">
                                                                        <div
                                                                            onClick={() => !isTaught && setLessonType('reja')}
                                                                            className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                                                                                lessonType === 'reja'
                                                                                    ? 'border-[#00b87c]'
                                                                                    : 'border-gray-300'
                                                                            } ${isTaught ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        >
                                                                            {lessonType === 'reja' && <div className="w-[8px] h-[8px] rounded-full bg-[#00b87c]"></div>}
                                                                        </div>
                                                                        <span className="text-[14px] font-[600] text-gray-700">O'quv reja bo'yicha</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-[8px] cursor-pointer">
                                                                        <div
                                                                            onClick={() => !isTaught && setLessonType('boshqa')}
                                                                            className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                                                                                lessonType === 'boshqa'
                                                                                    ? 'border-[#00b87c]'
                                                                                    : 'border-gray-300'
                                                                            } ${isTaught ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        >
                                                                            {lessonType === 'boshqa' && <div className="w-[8px] h-[8px] rounded-full bg-[#00b87c]"></div>}
                                                                        </div>
                                                                        <span className="text-[14px] font-[700] text-[#00b87c]">Boshqa</span>
                                                                    </label>
                                                                </div>

                                                                {/* Mavzu */}
                                                                <div>
                                                                    <label className="block text-[13px] font-[700] text-red-500 mb-[8px]">* Mavzu</label>
                                                                    <input
                                                                        type="text"
                                                                        value={mavzu}
                                                                        onChange={e => setMavzu(e.target.value)}
                                                                        placeholder="Mavzuni kiriting..."
                                                                        disabled={isTaught}
                                                                        className={`w-full px-[14px] py-[11px] border border-gray-200 rounded-[10px] outline-none focus:border-[#00b87c] text-[14px] font-[500] transition-colors ${isTaught ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
                                                                    />
                                                                </div>

                                                                {/* Tavsif */}
                                                                <div>
                                                                    <label className="block text-[13px] font-[700] text-gray-700 mb-[8px]">Tavsif <span className="text-gray-400 font-[400]">(Ixtiyoriy)</span></label>
                                                                    <textarea
                                                                        value={tavsif}
                                                                        onChange={e => setTavsif(e.target.value)}
                                                                        placeholder="Tavsif kiriting..."
                                                                        rows={3}
                                                                        disabled={isTaught}
                                                                        className={`w-full px-[14px] py-[11px] border border-gray-200 rounded-[10px] outline-none focus:border-[#00b87c] text-[14px] font-[500] resize-none transition-colors ${isTaught ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
                                                                    />
                                                                </div>

                                                                {/* Talabalar yo'qlama jadvali */}
                                                                <div>
                                                                    {studentsLoading ? (
                                                                        <div className="py-[20px] text-center text-gray-400 text-[14px] font-[600]">
                                                                            <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                                                                            Talabalar yuklanmoqda...
                                                                        </div>
                                                                    ) : groupStudents.length > 0 ? (
                                                                        <table className="w-full border-collapse">
                                                                            <thead>
                                                                                <tr className="border-b border-gray-100">
                                                                                    <th className="py-[10px] px-[12px] text-left text-[12px] font-[700] text-gray-400">#</th>
                                                                                    <th className="py-[10px] px-[12px] text-left text-[12px] font-[700] text-blue-500">O'quvchi ismi</th>
                                                                                    <th className="py-[10px] px-[12px] text-right text-[12px] font-[700] text-gray-400">Keldi</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {groupStudents.map((student, idx) => (
                                                                                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                                                        <td className="py-[12px] px-[12px] text-[13px] font-[600] text-gray-500">{idx + 1}</td>
                                                                                        <td className="py-[12px] px-[12px]">
                                                                                            <div className="flex items-center gap-[10px]">
                                                                                                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-[700] text-[13px] flex-shrink-0 overflow-hidden">
                                                                                                    {student.avatar
                                                                                                        ? <img
                                                                                                            src={student.avatar}
                                                                                                            alt={student.name}
                                                                                                            className="w-full h-full object-cover"
                                                                                                            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = student.initial }}
                                                                                                          />
                                                                                                        : student.initial
                                                                                                    }
                                                                                                </div>
                                                                                                <span className="text-[14px] font-[600] text-gray-800">{student.name}</span>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="py-[12px] px-[12px] text-right">
                                                                                            <button
                                                                                                onClick={() => !isTaught && setAttendance(prev => ({ ...prev, [student.id]: !prev[student.id] }))}
                                                                                                disabled={isTaught}
                                                                                                className={`relative inline-flex items-center w-[44px] h-[24px] rounded-full transition-all duration-300 focus:outline-none ${
                                                                                                    attendance[student.id]
                                                                                                        ? 'bg-[#7c3aed]'
                                                                                                        : 'bg-gray-200'
                                                                                                } ${isTaught ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                                            >
                                                                                                <span className={`inline-block w-[18px] h-[18px] rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                                                                                                    attendance[student.id] ? 'translate-x-[22px]' : 'translate-x-[3px]'
                                                                                                }`}></span>
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    ) : (
                                                                        <div className="py-[16px] text-center text-gray-400 text-[13px] font-[500]">
                                                                            Bu guruhda talabalar topilmadi
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Saqlash tugmasi */}
                                                                {!isTaught && (
                                                                    <>
                                                                        <div className="flex justify-end gap-[12px] pt-[4px]">
                                                                            <button
                                                                                onClick={() => setSelectedDate(null)}
                                                                                className="px-[20px] py-[10px] border border-gray-200 rounded-[10px] text-gray-600 font-[700] hover:bg-gray-50 transition-colors"
                                                                            >
                                                                                Bekor qilish
                                                                            </button>
                                                                            <button
                                                                                onClick={handleSaveAttendance}
                                                                                disabled={attendanceSaving}
                                                                                className="px-[24px] py-[10px] bg-[#00b87c] hover:bg-[#009e6a] text-white font-[700] rounded-[10px] transition-colors disabled:opacity-60"
                                                                            >
                                                                                {attendanceSaving ? (
                                                                                    <><i className="fa-solid fa-spinner fa-spin mr-[8px]"></i> Saqlanmoqda...</>
                                                                                ) : (
                                                                                    'Saqlash'
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                        {attendanceMessage && (
                                                                            <p className={`mt-[12px] text-[14px] font-[600] ${attendanceError ? 'text-red-500' : 'text-green-500'}`}>
                                                                                {attendanceMessage}
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    );
                                                })()}

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
                                                                    isSelected={selectedDate === scheduleDate}
                                                                    onClick={() => {
                                                                        setSelectedDate(prev => prev === scheduleDate ? null : scheduleDate)
                                                                        setShowAllDates(false)
                                                                    }}
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

                    {!loading && !error && activeTab === "lessons" && (
                        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden">
                            <div className="px-[32px] py-[28px]">
                                <div className="flex items-center justify-between mb-[24px]">
                                    <h3 className="text-[20px] font-[800] text-gray-900">Guruh darsliklari</h3>
                                    {(activeLessonsTab === "homework" || activeLessonsTab === "videos") && (
                                        <button
                                            onClick={() => {
                                                if (activeLessonsTab === 'homework') {
                                                    navigate(`${location.pathname}/homework/create`)
                                                } else {
                                                    setIsVideoModalOpen(true)
                                                }
                                            }}
                                            className="px-[20px] py-[10px] bg-[#00b87c] hover:bg-[#009e6a] text-white font-[700] rounded-[8px] transition-colors"
                                        >
                                            Qo'shish
                                        </button>
                                    )}
                                </div>

                                <div className="flex mb-[28px] overflow-x-auto">
                                    <div className="flex gap-[4px] p-[6px] bg-[#f8fafc] rounded-[12px]">
                                        <button
                                            onClick={() => setActiveLessonsTab("homework")}
                                            className={`px-[20px] py-[8px] font-[600] text-[14px] rounded-[8px] transition-all whitespace-nowrap ${activeLessonsTab === "homework"
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Uyga vazifa
                                        </button>
                                        <button
                                            onClick={() => setActiveLessonsTab("videos")}
                                            className={`px-[20px] py-[8px] font-[600] text-[14px] rounded-[8px] transition-all whitespace-nowrap ${activeLessonsTab === "videos"
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Videolar
                                        </button>
                                        <button
                                            onClick={() => setActiveLessonsTab("exams")}
                                            className={`px-[20px] py-[8px] font-[600] text-[14px] rounded-[8px] transition-all whitespace-nowrap ${activeLessonsTab === "exams"
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Imtihonlar
                                        </button>
                                        <button
                                            onClick={() => setActiveLessonsTab("journal")}
                                            className={`px-[20px] py-[8px] font-[600] text-[14px] rounded-[8px] transition-all whitespace-nowrap ${activeLessonsTab === "journal"
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Jurnal
                                        </button>
                                    </div>
                                </div>

                                {activeLessonsTab === "homework" && (
                                    <>
                                        {homeworkLoading ? (
                                            <div className="border border-gray-100 rounded-[12px] py-[34px] text-center text-gray-400 font-[700]">
                                                <i className="fa-solid fa-spinner fa-spin mr-[8px]"></i>
                                                Uyga vazifalar yuklanmoqda...
                                            </div>
                                        ) : lessons.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="px-[20px] py-[14px] text-left text-gray-500 font-[600] text-[13px] w-[40px]">#</th>
                                                            <th className="px-[20px] py-[14px] text-left text-teal-500 font-[700] text-[13px]">Mavzu</th>
                                                            <th className="px-[20px] py-[14px] text-left text-gray-400 font-[500] text-[17px] w-[56px]">
                                                                <i className="fa-regular fa-user"></i>
                                                            </th>
                                                            <th className="px-[20px] py-[14px] text-left text-yellow-400 font-[500] text-[17px] w-[56px]">
                                                                <i className="fa-regular fa-clock"></i>
                                                            </th>
                                                            <th className="px-[20px] py-[14px] text-left w-[56px]">
                                                                <span className="inline-flex items-center justify-center w-[20px] h-[20px] rounded-full border-2 border-teal-500">
                                                                    <i className="fa-solid fa-check text-teal-500 text-[10px]"></i>
                                                                </span>
                                                            </th>
                                                            <th className="px-[20px] py-[14px] text-left text-gray-700 font-[600] text-[13px]">Berilgan vaqt</th>
                                                            <th className="px-[20px] py-[14px] text-left text-gray-700 font-[600] text-[13px]">Tugash vaqti</th>
                                                            <th className="px-[20px] py-[14px] text-left text-gray-700 font-[600] text-[13px]">Dars sanasi</th>
                                                            <th className="px-[16px] py-[14px] w-[40px]"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lessons.map((lesson, index) => {
                                                            const actualHomeworkId = Array.isArray(lesson.homework) && lesson.homework.length > 0 ? lesson.homework[0].id : (lesson.homework?.id || lesson.homeworkId || lesson.id);
                                                            return (
                                                                <tr 
                                                                    key={lesson.id || index} 
                                                                    onClick={() => navigate(`${location.pathname}/homework/${actualHomeworkId}/results`, { state: { lesson } })}
                                                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                                                >
                                                                <td className="px-[20px] py-[20px] text-gray-500 font-[500] text-[14px]">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="px-[20px] py-[20px]">
                                                                    {(() => {
                                                                        const pending = lesson.homeworkPending ?? lesson.pending_count ?? lesson.pendingCount ?? 0
                                                                        return Number(pending) > 0 ? (
                                                                            <span className="block w-full px-[14px] py-[8px] bg-[#ff6b6b] text-white rounded-[8px] font-[600] text-[14px]">
                                                                                {lesson.title || lesson.topic || lesson.name || lesson.subject || lesson.description || "—"}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-gray-900 font-[600] text-[14px]">
                                                                                {lesson.title || lesson.topic || lesson.name || lesson.subject || lesson.description || "—"}
                                                                            </span>
                                                                        )
                                                                    })()}
                                                                </td>
                                                                <td className="px-[20px] py-[20px] text-gray-900 font-[600] text-[14px]">
                                                                    {groupStudentsCount || groupStudents.length || group?.studentCount || group?.students?.length || 0}
                                                                </td>
                                                                <td className="px-[20px] py-[20px] text-gray-900 font-[600] text-[14px]">
                                                                    {lesson.homeworkPending ?? lesson.pending_count ?? lesson.pendingCount ?? 0}
                                                                </td>
                                                                <td className="px-[20px] py-[20px] text-gray-900 font-[600] text-[14px]">
                                                                    {lesson.homeworkAccept ?? lesson.completed ?? lesson.completed_count ?? 0}
                                                                </td>
                                                                <td className="px-[20px] py-[20px] text-gray-600 font-[400] text-[14px]">
                                                                    {formatDateTime(lesson.created_at || lesson.createdAt || lesson.start_date)}
                                                                </td>
                                                                <td className="px-[20px] py-[20px] text-gray-600 font-[400] text-[14px]">
                                                                    {formatDateTime(lesson.end_date || lesson.endDate || lesson.deadline)}
                                                                </td>
                                                                <td className="px-[20px] py-[20px] text-gray-600 font-[400] text-[14px]">
                                                                    {formatDateTime(lesson.lesson_date || lesson.lessonDate || lesson.date)}
                                                                </td>
                                                                <td className="px-[16px] py-[20px] text-right">
                                                                    <button className="w-[28px] h-[28px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ml-auto text-gray-400 hover:text-gray-700">
                                                                        <i className="fa-solid fa-ellipsis-vertical text-[15px]"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )})}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-gray-200 rounded-[12px] py-[34px] text-center text-gray-400 font-[700]">
                                                Uyga vazifa topilmadi
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeLessonsTab === "videos" && (
                                    <>
                                        {videosLoading ? (
                                            <div className="border border-gray-100 rounded-[12px] py-[34px] text-center text-gray-400 font-[700]">
                                                <i className="fa-solid fa-spinner fa-spin mr-[8px]"></i>
                                                Videolar yuklanmoqda...
                                            </div>
                                        ) : videosError ? (
                                            <div className="border border-red-100 rounded-[12px] py-[34px] text-center text-red-400 font-[700]">
                                                <i className="fa-solid fa-circle-exclamation mr-[8px]"></i>
                                                {videosError}
                                                <div className="mt-[12px]">
                                                    <button
                                                        onClick={fetchVideos}
                                                        className="px-[16px] py-[8px] bg-teal-500 text-white rounded-[8px] text-[13px] font-[700] hover:bg-teal-600 transition-colors"
                                                    >
                                                        Qayta urinish
                                                    </button>
                                                </div>
                                            </div>
                                        ) : videos.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-100">
                                                            <th className="px-[20px] py-[16px] text-left text-gray-400 font-[700] text-[13px] w-[60px]">#</th>
                                                            <th className="px-[20px] py-[16px] text-left text-gray-400 font-[700] text-[13px]">Video nomi</th>
                                                            <th className="px-[20px] py-[16px] text-left text-gray-400 font-[700] text-[13px]">Dars nomi</th>
                                                            <th className="px-[20px] py-[16px] text-left text-gray-400 font-[700] text-[13px]">Status</th>
                                                            <th className="px-[20px] py-[16px] text-left text-gray-400 font-[700] text-[13px]">Dars sanasi</th>
                                                            <th className="px-[20px] py-[16px] text-left text-gray-400 font-[700] text-[13px]">Hajmi</th>
                                                            <th className="px-[20px] py-[16px] text-left text-gray-400 font-[700] text-[13px]">Qo'shilgan vaqti</th>
                                                            <th className="px-[20px] py-[16px] w-[40px]"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {videos.map((file, index) => {
                                                            const fileId = file.id || file._id || index + 1
                                                            
                                                            let fallbackName = "Nomsiz video";
                                                            let videoUrlForName = file.url || file.file_url || file.fileUrl || file.path || "";
                                                            if (videoUrlForName) {
                                                                const parts = videoUrlForName.split("/");
                                                                if(parts.length > 0 && parts[parts.length - 1]) {
                                                                    fallbackName = parts[parts.length - 1];
                                                                }
                                                            }
                                                            const fileName = file.originalname || file.name || file.title || file.file_name || file.fileName || file.original_name || file.originalName || fallbackName;
                                                            
                                                            const fileSize = file.size || file.file_size || file.fileSize;
                                                            const fileSizeMb = file.size_mb;
                                                            const createdAt = file.created_at || file.createdAt || file.date;
                                                            const lessonName = file.lesson?.topic || file.lesson?.title || file.lesson?.name || file.lesson_name || "Biriktirilmagan dars";
                                                            const lessonDate = file.lesson?.date || file.lesson?.lesson_date || file.lesson_date;

                                                            const formatSize = (bytes) => {
                                                                if (!bytes) return "3.53 MB"
                                                                const kb = bytes / 1024
                                                                if (kb < 1024) return `${kb.toFixed(1)} KB`
                                                                return `${(kb / 1024).toFixed(1)} MB`
                                                            }

                                                            return (
                                                                <tr 
                                                                    key={fileId} 
                                                                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer`}
                                                                    onClick={() => {
                                                                        const rawUrl = file.video_url || file.url || file.file_url || file.fileUrl || file.path || file.file_path || file.filePath || "";
                                                                        const fId = file.id || file._id || file.file_id || file.fileId;
                                                                        
                                                                        let videoUrl = "";
                                                                        if (rawUrl) {
                                                                            if (rawUrl.startsWith("http")) {
                                                                                videoUrl = rawUrl;
                                                                            } else {
                                                                                const normalizedRaw = rawUrl.replace(/^\/+/, "");
                                                                                const fileName = normalizedRaw.split("/").pop();
                                                                                videoUrl = `https://najot-edu.softwareengineer.uz/files/files/${fileName}`;
                                                                            }
                                                                        }
                                                                        
                                                                        const tok = (token || '').replace(/^Bearer\s+/i, '').trim();
                                                                        
                                                                        console.log('Video clicked:', { videoUrl, rawUrl, fId, file });
                                                                        setSelectedVideoPlayer({
                                                                            url: videoUrl,
                                                                            token: tok,
                                                                            fileId: fId,
                                                                            rawVideoUrl: rawUrl,
                                                                            name: fileName,
                                                                            size: fileSizeMb ? `${fileSizeMb.toFixed(2)} MB` : formatSize(fileSize),
                                                                            lesson: lessonName,
                                                                            date: createdAt ? formatDateOnly(createdAt) : "Noma'lum"
                                                                        });
                                                                    }}
                                                                >
                                                                    <td className="px-[20px] py-[20px] text-gray-900 font-[600] text-[14px]">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td className="px-[20px] py-[20px] text-blue-500 font-[600] text-[14px]">
                                                                        <div className="flex items-center gap-[8px]">
                                                                            <i className="fa-regular fa-circle-play text-[16px]"></i>
                                                                            <span>{fileName}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-[20px] py-[20px] text-gray-900 font-[600] text-[14px]">
                                                                        {lessonName}
                                                                    </td>
                                                                    <td className="px-[20px] py-[20px]">
                                                                        <span className="px-[12px] py-[4px] bg-green-50 text-green-500 rounded-full text-[12px] font-[700]">Tayyor</span>
                                                                    </td>
                                                                    <td className="px-[20px] py-[20px] text-gray-600 font-[500] text-[14px]">
                                                                        {lessonDate ? formatDateOnly(lessonDate) : "Noma'lum"}
                                                                    </td>
                                                                    <td className="px-[20px] py-[20px] text-gray-600 font-[500] text-[14px]">
                                                                        {fileSizeMb ? `${fileSizeMb.toFixed(2)} MB` : formatSize(fileSize)}
                                                                    </td>
                                                                    <td className="px-[20px] py-[20px] text-gray-600 font-[500] text-[14px]">
                                                                        {createdAt ? formatDateOnly(createdAt) : "Noma'lum"}
                                                                    </td>
                                                                    <td className="px-[20px] py-[20px] text-right relative">
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setOpenVideoMenuId(openVideoMenuId === fileId ? null : fileId);
                                                                            }}
                                                                            className="w-[28px] h-[28px] flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors ml-auto text-gray-400 hover:text-gray-700"
                                                                        >
                                                                            <i className="fa-solid fa-ellipsis-vertical text-[15px]"></i>
                                                                        </button>
                                                                        
                                                                        {openVideoMenuId === fileId && (
                                                                            <div className="absolute right-[40px] top-[50%] -translate-y-[50%] bg-white border border-gray-100 shadow-lg rounded-[8px] w-[140px] z-10 py-[4px] animate-fade-in">
                                                                                <button 
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleDeleteVideo(fileId);
                                                                                    }}
                                                                                    className="w-full text-left px-[16px] py-[8px] text-[13px] font-[600] text-red-500 hover:bg-red-50 transition-colors flex items-center gap-[8px]"
                                                                                >
                                                                                    <i className="fa-regular fa-trash-can"></i> O'chirish
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-gray-200 rounded-[12px] py-[48px] text-center">
                                                <div className="w-[60px] h-[60px] bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-[16px]">
                                                    <i className="fa-solid fa-circle-play text-purple-400 text-[26px]"></i>
                                                </div>
                                                <p className="text-gray-500 font-[700] text-[15px]">Videolar topilmadi</p>
                                                <p className="text-gray-400 font-[500] text-[13px] mt-[6px]">Bu guruh uchun hali video yuklanmagan</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeLessonsTab === "exams" && (
                                    <div className="animate-fade-in">
                                        <div className="flex justify-end mb-[20px]">
                                            <button 
                                                onClick={() => navigate(`${location.pathname}/exams/create`)}
                                                className="px-[24px] py-[10px] bg-[#00b87c] hover:bg-[#009e6a] text-white font-[700] rounded-[8px] transition-colors"
                                            >
                                                Yangi imtihon
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto border border-gray-100 rounded-[12px]">
                                            <table className="w-full min-w-[900px]">
                                                <thead>
                                                    <tr className="border-b border-gray-100 bg-white">
                                                        <th className="px-[24px] py-[18px] text-left text-gray-500 font-[700] text-[14px] w-[60px]">#</th>
                                                        <th className="px-[20px] py-[18px] text-left text-gray-500 font-[700] text-[14px]">Mavzu</th>
                                                        <th className="px-[20px] py-[18px] text-center text-gray-400 font-[500] text-[18px] w-[80px]">
                                                            <i className="fa-regular fa-user"></i>
                                                        </th>
                                                        <th className="px-[20px] py-[18px] text-center text-[#f06548] font-[500] text-[18px] w-[80px]">
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </th>
                                                        <th className="px-[20px] py-[18px] text-left text-gray-500 font-[700] text-[14px] w-[120px]">Status</th>
                                                        <th className="px-[20px] py-[18px] text-left text-gray-500 font-[700] text-[14px]">Dars vaqti</th>
                                                        <th className="px-[20px] py-[18px] text-left text-gray-500 font-[700] text-[14px]">Berilgan vaqt</th>
                                                        <th className="px-[20px] py-[18px] text-left text-gray-500 font-[700] text-[14px]">E'lon qilingan<br/>vaqti</th>
                                                        <th className="px-[16px] py-[18px] w-[60px]"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        { id: 7, title: "Examination", students: 12, misses: 0, status: "Faol", lessonTime: "22 May, 2026 09:30", givenTime: "22 May, 2026 09:28", announcedTime: "-" },
                                                        { id: 6, title: "Examination", students: 12, misses: 0, status: "Tugagan", lessonTime: "24 Apr, 2026 09:30", givenTime: "24 Apr, 2026 09:25", announcedTime: "27 Apr, 2026 10:30" },
                                                        { id: 5, title: "Examination", students: 14, misses: 0, status: "Tugagan", lessonTime: "26 Mart, 2026 09:30", givenTime: "26 Mart, 2026 09:23", announcedTime: "30 Mart, 2026 14:34" },
                                                        { id: 4, title: "Examination", students: 16, misses: 0, status: "Tugagan", lessonTime: "26 Fev, 2026 09:30", givenTime: "26 Fev, 2026 09:28", announcedTime: "02 Mart, 2026 13:32" },
                                                    ].map((exam) => (
                                                        <tr 
                                                            key={exam.id} 
                                                            onClick={() => navigate(`${location.pathname}/exams/${exam.id}`)}
                                                            className="border-b border-gray-50 bg-white hover:bg-gray-50/50 transition-colors cursor-pointer"
                                                        >
                                                            <td className="px-[24px] py-[18px] text-gray-900 font-[600] text-[14px]">{exam.id}</td>
                                                            <td className="px-[20px] py-[18px] text-[#008de4] font-[600] text-[14px]">{exam.title}</td>
                                                            <td className="px-[20px] py-[18px] text-center text-gray-900 font-[600] text-[14px]">{exam.students}</td>
                                                            <td className="px-[20px] py-[18px] text-center text-gray-900 font-[600] text-[14px]">{exam.misses}</td>
                                                            <td className="px-[20px] py-[18px]">
                                                                <span className={`inline-flex items-center justify-center px-[16px] py-[4px] rounded-full text-[13px] font-[600] ${
                                                                    exam.status === 'Faol' 
                                                                        ? 'text-[#00b87c] border border-[#00b87c]' 
                                                                        : 'text-gray-500 border border-gray-300'
                                                                }`}>
                                                                    {exam.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-[20px] py-[18px] text-gray-700 font-[500] text-[14px] pr-[10px] leading-[22px]">{exam.lessonTime}</td>
                                                            <td className="px-[20px] py-[18px] text-gray-700 font-[500] text-[14px] pr-[10px] leading-[22px]">{exam.givenTime}</td>
                                                            <td className="px-[20px] py-[18px] text-gray-700 font-[500] text-[14px] pr-[10px] leading-[22px]">{exam.announcedTime}</td>
                                                            <td className="px-[16px] py-[18px] text-right">
                                                                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors ml-auto">
                                                                    <i className="fa-solid fa-ellipsis-vertical text-[16px]"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeLessonsTab === "journal" && (
                                    <div className="border border-dashed border-gray-200 rounded-[12px] py-[34px] text-center text-gray-400 font-[700]">
                                        Jurnal topilmadi
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!loading && !error && activeTab === "attendance" && (
                        <div className="bg-white border border-gray-200 rounded-[14px] px-[32px] py-[34px]">
                            <h3 className="text-[20px] font-[800] text-gray-900 mb-[28px]">Akademik davomati</h3>
                            <div className="border border-dashed border-gray-200 rounded-[12px] py-[34px] text-center text-gray-400 font-[700]">
                                Akademik davomati ma'lumotlari topilmadi
                            </div>
                        </div>
                    )}

                    {isMentorsModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-[14px] w-full max-w-[600px] mx-[20px] overflow-hidden shadow-lg max-h-[80vh] flex flex-col">
                                <div className="bg-blue-500 text-white px-[32px] py-[20px] flex items-center justify-between flex-shrink-0">
                                    <h3 className="text-[18px] font-[800]">Guruh mentorlari</h3>
                                    <button
                                        onClick={() => setIsMentorsModalOpen(false)}
                                        className="w-[32px] h-[32px] flex items-center justify-center hover:bg-blue-600 rounded-[6px] transition-colors"
                                    >
                                        <i className="fa-solid fa-xmark text-[20px]"></i>
                                    </button>
                                </div>

                                <div className="overflow-y-auto flex-1 p-[32px]">
                                    <div className="grid grid-cols-2 gap-[28px]">
                                        {mentors.map((teacher, index) => (
                                            <div key={index} className="flex flex-col items-center gap-[12px] p-[12px] rounded-[12px] hover:bg-gray-50 transition-colors">                                                <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[32px] font-[600] overflow-hidden flex-shrink-0">
                                                    {teacher?.avatar ? (
                                                        <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{teacher.name.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-[12px] font-[600] text-teal-500 mb-[4px]">{teacher.role || "Teacher"}</span>
                                                    <h4 className="text-[15px] font-[800] text-gray-900 line-clamp-2">
                                                        {teacher.name}
                                                    </h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Qo'shish Modali */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px]">
                    <div
                        className="absolute inset-0 bg-black/60 transition-opacity"
                        onClick={() => setIsVideoModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-[16px] shadow-2xl w-full max-w-[800px] flex flex-col animate-fade-in">
                        <div className="px-[24px] py-[20px] border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-[18px] font-[800] text-gray-900">Qo'shish</h3>
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <i className="fa-solid fa-xmark text-[16px]"></i>
                            </button>
                        </div>
                        <div className="p-[32px]">
                            <label
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[16px] py-[60px] px-[20px] transition-colors cursor-pointer ${
                                    videoDragOver ? 'border-[#00b87c] bg-[#00b87c]/5' : 'border-gray-200 hover:border-[#00b87c] bg-white'
                                }`}
                                onDragOver={(e) => { e.preventDefault(); setVideoDragOver(true); }}
                                onDragLeave={() => setVideoDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setVideoDragOver(false);
                                    if (e.dataTransfer.files?.[0]) {
                                        setVideoFile(e.dataTransfer.files[0]);
                                        setVideoNameInput(e.dataTransfer.files[0].name);
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".mp4,.webm,.mpeg,.avi,.mkv,.m4v,.ogm,.mov"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setVideoFile(e.target.files[0]);
                                            setVideoNameInput(e.target.files[0].name);
                                        }
                                    }}
                                />
                                <div className="mb-[24px] text-[#00b87c]">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                                        <line x1="12" y1="10" x2="12" y2="16" />
                                        <line x1="9" y1="13" x2="15" y2="13" />
                                    </svg>
                                </div>
                                <p className="text-[16px] font-[700] text-gray-800 text-center mb-[12px]">
                                    Videofaylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                                </p>
                                <p className="text-[13px] font-[500] text-gray-400 text-center max-w-[80%]">
                                    Videofayl: .mp4, .webm, .mpeg, .avi, .mkv, .m4v, .ogm, .mov formatlaridan birida bo'lishi kerak
                                </p>
                            </label>
                            {videoFile && (
                                <div className="mt-[24px] border border-gray-100 rounded-[12px] overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                                <th className="px-[20px] py-[12px] text-[13px] font-[700] text-gray-700">File name</th>
                                                <th className="px-[20px] py-[12px] text-[13px] font-[700] text-gray-700"><span className="text-red-500">*</span> Dars</th>
                                                <th className="px-[20px] py-[12px] text-[13px] font-[700] text-gray-700"><span className="text-red-500">*</span> Video nomi</th>
                                                <th className="px-[20px] py-[12px] text-[13px] font-[700] text-gray-700 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="px-[20px] py-[16px] text-[14px] font-[500] text-gray-900 border-r border-gray-100">
                                                    {videoFile.name}
                                                </td>
                                                <td className="px-[20px] py-[16px] border-r border-gray-100">
                                                    <select value={selectedVideoLessonId} onChange={(e) => setSelectedVideoLessonId(e.target.value)} className="w-full text-[14px] outline-none bg-transparent text-gray-500 cursor-pointer">
                                                        <option value="">Darsni tanlang</option>
                                                        {(generalLessons?.length > 0 ? generalLessons : (lessons?.length > 0 ? lessons : schedules))?.map((l, index) => (
                                                            <option key={l.id || l._id || index} value={l.id || l._id || index}>
                                                                {l.name || l.title || l.lesson_name || l.lesson_title || l.mavzu || l.topic || l.lesson_topic || `Dars ${index + 1}`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-[20px] py-[16px] border-r border-gray-100">
                                                    <input type="text" className="w-full text-[14px] outline-none bg-transparent text-gray-900 font-[500]" value={videoNameInput} onChange={(e) => setVideoNameInput(e.target.value)} />
                                                </td>
                                                <td className="px-[20px] py-[16px] text-center">
                                                    <button onClick={() => setVideoFile(null)} className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors mx-auto">
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="px-[24px] py-[20px] border-t border-gray-100 flex justify-end gap-[12px]">
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                className="px-[20px] py-[10px] font-[700] text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button 
                                onClick={handleVideoUpload}
                                className={`px-[24px] py-[10px] font-[700] rounded-[8px] transition-colors shadow-sm ${videoFile && !isUploading ? 'bg-[#00b87c] hover:bg-[#009e6a] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                disabled={!videoFile || isUploading}
                            >
                                {isUploading ? (
                                    <><i className="fa-solid fa-spinner fa-spin mr-[8px]"></i> Yuklanmoqda...</>
                                ) : (
                                    "Fayllarni yuklash"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Player Modali */}
            {selectedVideoPlayer && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-[40px]">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedVideoPlayer(null)}
                    ></div>
                    <div className="relative bg-[#1a1d27] rounded-[16px] shadow-2xl w-full max-w-[1000px] flex flex-col overflow-hidden animate-fade-in border border-gray-800">
                        {/* Header */}
                        <div className="px-[24px] py-[16px] flex items-center justify-between border-b border-gray-800/50 bg-[#1a1d27]">
                            <div className="flex items-center gap-[12px] text-blue-400">
                                <i className="fa-regular fa-circle-play text-[20px]"></i>
                                <h3 className="text-[16px] font-[700] text-white tracking-wide">{selectedVideoPlayer.name}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedVideoPlayer(null)}
                                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fa-solid fa-xmark text-[16px]"></i>
                            </button>
                        </div>
                        
                        {/* Video Area */}
                        <div className="w-full bg-black flex items-center justify-center relative aspect-video">
                            <VideoPlayer 
                                url={selectedVideoPlayer.url}
                                token={selectedVideoPlayer.token}
                                fileId={selectedVideoPlayer.fileId}
                                rawVideoUrl={selectedVideoPlayer.rawVideoUrl}
                            />
                        </div>
                        {/* Debug: show URL */}
                        <div className="px-[24px] py-[8px] bg-[#111] border-t border-gray-800/30">
                            <p className="text-[11px] text-gray-500 font-mono break-all">URL: <a href={selectedVideoPlayer.url} target="_blank" rel="noreferrer" className="text-blue-400 underline">{selectedVideoPlayer.url}</a></p>
                        </div>

                        {/* Footer Details */}
                        <div className="px-[24px] py-[16px] bg-[#1a1d27] border-t border-gray-800/50 flex flex-wrap items-center gap-x-[32px] gap-y-[12px]">
                            <div className="text-[14px]">
                                <span className="text-gray-400 font-[500]">Fayl:</span> <span className="text-white font-[700] ml-[4px]">{selectedVideoPlayer.name}</span>
                            </div>
                            <div className="text-[14px]">
                                <span className="text-gray-400 font-[500]">Hajmi:</span> <span className="text-white font-[700] ml-[4px]">{selectedVideoPlayer.size}</span>
                            </div>
                            <div className="text-[14px]">
                                <span className="text-gray-400 font-[500]">Dars:</span> <span className="text-white font-[700] ml-[4px]">{selectedVideoPlayer.lesson}</span>
                            </div>
                            <div className="text-[14px]">
                                <span className="text-gray-400 font-[500]">Sana:</span> <span className="text-white font-[700] ml-[4px]">{selectedVideoPlayer.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* O'chirish tasdiqlash modali */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-[20px]">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setDeleteConfirmId(null)}
                    ></div>
                    <div className="relative bg-white rounded-[16px] shadow-2xl w-full max-w-[380px] p-[32px] animate-fade-in">
                        <h3 className="text-[18px] font-[800] text-gray-900 mb-[12px]">Videoni o'chirish</h3>
                        <p className="text-[14px] font-[500] text-gray-500 mb-[28px]">Rostdan ham o'chirishni xohlaysizmi?</p>
                        <div className="flex items-center justify-end gap-[12px]">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-[20px] py-[10px] font-[700] text-gray-500 hover:text-gray-700 text-[14px] transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={confirmDeleteVideo}
                                className="px-[28px] py-[10px] bg-[#e84a6a] hover:bg-[#d43a5a] text-white font-[700] text-[14px] rounded-[10px] transition-colors shadow-sm"
                            >
                                Ha
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
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

