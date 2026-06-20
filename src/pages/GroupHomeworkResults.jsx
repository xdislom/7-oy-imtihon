import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import TeacherSidebar from "../components/TeacherSidebar"

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

export default function GroupHomeworkResults() {
    const { groupId, homeworkId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("PENDING")
    const [tabCounts, setTabCounts] = useState({ PENDING: 0, REJECTED: 0, ACCEPTED: 0, UNSUBMITTED: 0 })
    const [lessonData, setLessonData] = useState(location.state?.lesson || null)
    
    // As per screenshot
    const tabs = [
        { id: "PENDING", label: "Kutayotganlar" },
        { id: "REJECTED", label: "Qaytarilganlar" },
        { id: "ACCEPTED", label: "Qabul qilinganlar" },
        { id: "UNSUBMITTED", label: "Bajarilmagan" }
    ]

    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchLesson = async () => {
            if (!token || !homeworkId) return
            try {
                const tok = token.replace(/^Bearer\s+/i, '').trim()
                const res = await fetch(`${API_URL}/homework/${homeworkId}`, {
                    headers: { 'Authorization': `Bearer ${tok}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setLessonData(data.data || data)
                }
            } catch (err) {
                console.error("Error fetching lesson:", err)
            }
        }
        if (!lessonData || (!lessonData.title && !lessonData.name && !lessonData.topic)) {
            fetchLesson()
        }
    }, [homeworkId, token])

    useEffect(() => {
        const fetchCounts = async () => {
            if (!token) return
            try {
                const tok = token.replace(/^Bearer\s+/i, '').trim()
                
                // 1. Guruh o'quvchilarini olamiz
                const studentsRes = await fetch(`${API_URL}/groups/one/students/${groupId}`, {
                    headers: { 'Authorization': `Bearer ${tok}` }
                })
                let totalStudents = 0
                if (studentsRes.ok) {
                    const studentsData = await studentsRes.json()
                    const studentsList = Array.isArray(studentsData) ? studentsData 
                        : Array.isArray(studentsData?.data) ? studentsData.data 
                        : Array.isArray(studentsData?.data?.data) ? studentsData.data.data : []
                    totalStudents = studentsList.length
                }

                // 2. Qolgan uchta status bo'yicha ma'lumotlarni olamiz
                const statuses = ["PENDING", "REJECTED", "ACCEPTED"]
                const promises = statuses.map(status => 
                    fetch(`${API_URL}/group/${groupId}/homework/${homeworkId}/results?status=${status}`, {
                        headers: { 'Authorization': `Bearer ${tok}` }
                    }).then(res => res.ok ? res.json() : [])
                )
                
                const resultsArr = await Promise.all(promises)
                
                let pendingCount = 0
                let rejectedCount = 0
                let acceptedCount = 0
                let submittedIds = new Set()

                resultsArr.forEach((data, index) => {
                    const list = Array.isArray(data) ? data
                        : Array.isArray(data?.data?.students) ? data.data.students
                        : Array.isArray(data?.data) ? data.data
                        : Array.isArray(data?.students) ? data.students
                        : Array.isArray(data?.data?.data) ? data.data.data : []
                        
                    const count = list.length
                    if (index === 0) pendingCount = count
                    else if (index === 1) rejectedCount = count
                    else if (index === 2) acceptedCount = count

                    list.forEach(item => {
                        const sid = item.student?.id || item.student_id || item.student?._id || item.id || item._id
                        if (sid) submittedIds.add(String(sid))
                    })
                })

                const unsubmittedCount = Math.max(0, totalStudents - submittedIds.size)

                setTabCounts({
                    PENDING: pendingCount,
                    REJECTED: rejectedCount,
                    ACCEPTED: acceptedCount,
                    UNSUBMITTED: unsubmittedCount
                })
            } catch (err) {
                console.error("Error fetching tab counts:", err)
            }
        }
        
        fetchCounts()
    }, [groupId, homeworkId, token, activeTab]) // Har safar tab o'zgarganda (baho qo'yilganda) yangilanadi

    useEffect(() => {
        fetchResults()
    }, [activeTab, groupId, homeworkId])

    const fetchResults = async () => {
        if (!token) return
        setLoading(true)
        setError("")
        try {
            const tok = token.replace(/^Bearer\s+/i, '').trim()
            
            if (activeTab === "UNSUBMITTED") {
                // 1. Guruh o'quvchilarini olamiz
                let studentsList = []
                try {
                    const studentsRes = await fetch(`${API_URL}/groups/one/students/${groupId}`, {
                        headers: { 'Authorization': `Bearer ${tok}` }
                    })
                    if (studentsRes.ok) {
                        const studentsData = await studentsRes.json()
                        studentsList = Array.isArray(studentsData) ? studentsData 
                            : Array.isArray(studentsData?.data) ? studentsData.data 
                            : Array.isArray(studentsData?.data?.data) ? studentsData.data.data : []
                    } else {
                        throw new Error("Failed to fetch students from API")
                    }
                } catch (err) {
                    console.warn("API dan o'quvchilarni yuklashda xatolik, localStorage dan olinmoqda:", err)
                    const savedGroup = JSON.parse(sessionStorage.getItem("selectedGroup") || "{}")
                    studentsList = savedGroup?.students || savedGroup?.student_list || savedGroup?.studentList || []
                }
                
                // 2. Qolgan uchta status bo'yicha ma'lumotlarni olamiz (Kutayotgan, Qaytarilgan, Qabul qilingan)
                const statuses = ["PENDING", "REJECTED", "ACCEPTED"]
                const promises = statuses.map(status => 
                    fetch(`${API_URL}/group/${groupId}/homework/${homeworkId}/results?status=${status}`, {
                        headers: { 'Authorization': `Bearer ${tok}` }
                    }).then(res => res.ok ? res.json() : [])
                )
                
                const resultsArr = await Promise.all(promises)
                
                // 3. Topshirgan o'quvchilarning ID larini yig'amiz
                const submittedStudentIds = new Set()
                resultsArr.forEach(data => {
                    const list = Array.isArray(data) ? data
                        : Array.isArray(data?.data?.students) ? data.data.students
                        : Array.isArray(data?.data) ? data.data
                        : Array.isArray(data?.students) ? data.students
                        : Array.isArray(data?.data?.data) ? data.data.data : []
                        
                    list.forEach(item => {
                        const sid = item.student?.id || item.student_id || item.student?._id || item.id || item._id
                        if (sid) submittedStudentIds.add(String(sid))
                    })
                })
                
                // 4. Barcha o'quvchilardan topshirganlarni olib tashlaymiz
                const validStudentsList = Array.isArray(studentsList) ? studentsList : []
                const unsubmittedStudents = validStudentsList
                    .filter(s => !submittedStudentIds.has(String(s.id || s._id)))
                    .map(s => ({
                        id: s.id || s._id,
                        student: {
                            id: s.id || s._id,
                            first_name: s.first_name,
                            last_name: s.last_name,
                            name: s.full_name || s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim()
                        },
                        created_at: null // Bajarilmaganlar uchun vaqt yo'q
                    }))
                    
                setResults(unsubmittedStudents)
            } else {
                // Oddiy statuslar uchun (PENDING, REJECTED, ACCEPTED) API dan so'raymiz
                const response = await fetch(`${API_URL}/group/${groupId}/homework/${homeworkId}/results?status=${activeTab}`, {
                    headers: { 'Authorization': `Bearer ${tok}` }
                })
                
                if (!response.ok) {
                    if (response.status === 404) {
                        setResults([])
                        setLoading(false)
                        return
                    }
                    throw new Error("Ma'lumotni yuklashda xatolik yuz berdi")
                }
                
                const data = await response.json()
                
                // O'zgaruvchilar tuzilishini har tomonlama tekshirish
                let list = []
                if (Array.isArray(data)) {
                    list = data
                } else if (data.data?.students && Array.isArray(data.data.students)) {
                    list = data.data.students
                } else if (data.data?.results && Array.isArray(data.data.results)) {
                    list = data.data.results
                } else if (data.data && Array.isArray(data.data)) {
                    list = data.data
                } else if (data.students && Array.isArray(data.students)) {
                    list = data.students
                } else if (data.results && Array.isArray(data.results)) {
                    list = data.results
                } else if (data.data?.data && Array.isArray(data.data.data)) {
                    list = data.data.data
                } else if (data.items && Array.isArray(data.items)) {
                    list = data.items
                }

                // ACCEPTED yoki REJECTED bo'lsa — har bir o'quvchining ballini individual endpoint dan olamiz
                if ((activeTab === 'ACCEPTED' || activeTab === 'REJECTED') && list.length > 0) {
                    const gradePromises = list.map(async (item) => {
                        const sid = item.student?.id || item.student?._id || item.id || item._id
                        if (!sid) return item
                        try {
                            const targetLessonId = lesson?.lesson_id || lesson?.id || location.state?.lesson?.id;
                            const res = await fetch(
                                targetLessonId 
                                    ? `${API_URL}/group/${groupId}/lesson/${targetLessonId}/homework/${homeworkId}/student/${sid}`
                                    : `${API_URL}/group/${groupId}/homework/${homeworkId}/result/${sid}`,
                                { headers: { 'Authorization': `Bearer ${tok}` } }
                            )
                            if (!res.ok) return item
                            const d = await res.json()
                            const detail = d?.data || d
                            const grade = detail.grade ?? detail.score ?? detail.ball ?? detail.point ?? detail.mark ?? detail.check?.grade ?? detail.homework_check?.grade ?? null
                            return { ...item, _fetchedGrade: grade }
                        } catch {
                            return item
                        }
                    })
                    const listWithGrades = await Promise.all(gradePromises)
                    setResults(listWithGrades)
                } else {
                    setResults(list)
                }
            }
        } catch (err) {
            console.error("Error fetching results:", err)
            setError(err.message)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const formatDateTime = (value) => {
        if (!value) return "—"
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return value
        const day = date.getDate()
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const month = monthNames[date.getMonth()]
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${day} ${month}, ${year} ${hours}:${minutes}`
    }

    const lesson = lessonData || {}
    const title = lesson.title || lesson.topic || lesson.name || lesson.subject || lesson.description || "Uyga vazifa natijalari"
    const endDate = lesson.end_date || lesson.endDate || lesson.deadline || null

    const roleStr = String(localStorage.getItem("role") || "").toLowerCase()
    const isTeacher = roleStr.includes("teacher") || roleStr.includes("mentor") || roleStr.includes("o'qituvchi") || location.pathname.startsWith("/dashboard/groups")

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
                    
                    <main className="mt-[28px]">
                        <div className="flex items-center gap-[12px] mb-[24px]">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] flex items-center justify-center rounded-[12px] bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <i className="fa-solid fa-chevron-left text-[13px] sm:text-[14px]"></i>
                        </button>
                        <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-[800] text-gray-900 tracking-[-0.5px]">
                            {title}
                        </h1>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-200/60 overflow-hidden mb-[24px]">
                        <div className="p-[20px] sm:p-[24px] lg:p-[32px] border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
                            <div>
                                <p className="text-[13px] text-gray-500 font-[500] mb-[4px]">Mavzu</p>
                                <p className="text-[16px] text-gray-900 font-[700]">{title}</p>
                            </div>
                            <div>
                                <p className="text-[13px] text-gray-500 font-[500] mb-[4px]">Tugash vaqti</p>
                                <p className="text-[16px] text-gray-900 font-[700]">{formatDateTime(endDate)}</p>
                            </div>
                        </div>

                        <div className="border-b border-gray-100 px-[20px] sm:px-[24px] lg:px-[32px] overflow-x-auto">
                            <div className="flex gap-[32px] min-w-max">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-[20px] font-[600] text-[14px] sm:text-[15px] border-b-[2px] transition-all flex items-center gap-[8px] ${
                                            activeTab === tab.id 
                                            ? 'border-teal-500 text-teal-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab.label}
                                        {tabCounts[tab.id] > 0 && (
                                            <span className="bg-[#f0ab00] text-white text-[11px] font-[700] px-[8px] py-[2px] rounded-full">
                                                {tabCounts[tab.id]}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-[20px] sm:p-[24px] lg:p-[32px]">
                            {loading ? (
                                <div className="py-[40px] text-center text-gray-400 font-[700]">
                                    <i className="fa-solid fa-spinner fa-spin mr-[8px]"></i>
                                    Natijalar yuklanmoqda...
                                </div>
                            ) : error ? (
                                <div className="py-[40px] text-center text-red-500 font-[600]">
                                    {error}
                                </div>
                            ) : results.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-[20px] py-[16px] text-left text-gray-500 font-[600] text-[13px]">O'quvchi ismi</th>
                                                <th className="px-[20px] py-[16px] text-left text-gray-500 font-[600] text-[13px]">Uyga vazifa jo'natilgan vaqt</th>
                                                {(activeTab === 'ACCEPTED' || activeTab === 'REJECTED') && (
                                                    <th className="px-[20px] py-[16px] text-left text-gray-500 font-[600] text-[13px]">Ball</th>
                                                )}
                                                {activeTab !== 'UNSUBMITTED' && (
                                                    <th className="px-[20px] py-[16px] w-[40px]"></th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result, index) => {
                                                const name = result.student?.full_name ||
                                                    (`${result.student?.first_name || ''} ${result.student?.last_name || ''}`).trim() ||
                                                    result.student?.name ||
                                                    result.name || result.full_name || "Noma'lum o'quvchi"
                                                console.log("🎯 Result obyekti (ball qidirish):", JSON.stringify(result, null, 2))
                                                const grade = result._fetchedGrade ?? result.grade ?? result.score ?? result.ball ?? result.point ?? result.mark ?? result.rating ?? result.check?.grade ?? result.homework_check?.grade ?? result.result?.grade ?? result.homework_answer?.grade ?? null
                                                const base = location.pathname.includes('/dashboard') ? '/dashboard' : '/classes'
                                                return (
                                                <tr
                                                    key={result.id || index}
                                                    className={`border-b border-gray-100 last:border-0 transition-colors ${
                                                        activeTab === 'UNSUBMITTED'
                                                            ? 'text-gray-400 cursor-default'
                                                            : 'hover:bg-indigo-50/60 cursor-pointer'
                                                    }`}
                                                    onClick={() => {
                                                        if (activeTab === 'UNSUBMITTED') return
                                                        // Student ID ni topamiz (URL uchun)
                                                        const targetStudentId =
                                                            result.student?.id ||
                                                            result.student?._id ||
                                                            result.id ||
                                                            result._id ||
                                                            String(index + 1)
                                                        // homework_answer_id ni result ichidan topamiz
                                                        const homeworkAnswerId =
                                                            result.homework_answer_id ||
                                                            result.answer_id ||
                                                            result.answer?.id ||
                                                            result.homework_answer?.id ||
                                                            result.id ||
                                                            null
                                                        const enrichedResult = {
                                                            ...result,
                                                            homework_answer_id: homeworkAnswerId
                                                        }
                                                        console.log("🔗 O'tish:", targetStudentId, "homeworkAnswerId:", homeworkAnswerId)
                                                        navigate(
                                                            `${base}/groups/${groupId}/homework/${homeworkId}/results/${targetStudentId}`,
                                                            { state: { student: enrichedResult, lesson, activeTab } }
                                                        )
                                                    }}
                                                >
                                                    <td className="px-[20px] py-[20px]">
                                                        <div className="flex items-center gap-[12px]">
                                                            <div className="w-[36px] h-[36px] rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-[700] text-[14px] shrink-0 overflow-hidden relative">
                                                                {(() => {
                                                                    let avatar = result.student?.avatar || result.student?.image || result.student?.photo || result.avatar || result.image || result.photo || null;
                                                                    if (avatar && avatar.startsWith('/')) {
                                                                        avatar = `https://najot-edu.softwareengineer.uz${avatar}`
                                                                    } else if (avatar && !avatar.startsWith('http')) {
                                                                        // Agar bu faqat fayl nomi bo'lsa (masalan, 1780572185085.png)
                                                                        avatar = `https://najot-edu.softwareengineer.uz/uploads/${avatar}`
                                                                    }
                                                                    
                                                                    return avatar ? (
                                                                        <>
                                                                            <img 
                                                                                src={avatar} 
                                                                                alt={name} 
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    e.target.style.display = 'none';
                                                                                    if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                                                }}
                                                                            />
                                                                            <span className="hidden w-full h-full items-center justify-center">
                                                                                {name.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="flex w-full h-full items-center justify-center">
                                                                            {name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    )
                                                                })()}
                                                            </div>
                                                            <span className="text-gray-900 font-[600] text-[14px]">{name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-[20px] py-[20px] text-gray-500 font-[500] text-[14px]">
                                                        {formatDateTime(result.created_at || result.createdAt || result.submitted_at || result.submittedAt)}
                                                    </td>
                                                    {(activeTab === 'ACCEPTED' || activeTab === 'REJECTED') && (
                                                        <td className="px-[20px] py-[20px]">
                                                            {grade !== null ? (
                                                                <span className={`inline-flex items-center px-[12px] py-[4px] rounded-full text-[13px] font-[700] ${
                                                                    grade >= 60
                                                                        ? 'bg-green-50 text-green-600 border border-green-200'
                                                                        : 'bg-red-50 text-red-500 border border-red-200'
                                                                }`}>
                                                                    {grade}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300 text-[13px]">—</span>
                                                            )}
                                                        </td>
                                                    )}
                                                    {activeTab !== 'UNSUBMITTED' && (
                                                        <td className="px-[20px] py-[20px]">
                                                            <div className="flex items-center gap-[6px] text-indigo-400 opacity-0 group-hover:opacity-100">
                                                                <i className="fa-solid fa-chevron-right text-[12px]"></i>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-[40px] text-center text-gray-400 font-[600]">
                                    Ushbu bo'limda ma'lumot yo'q
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            </div>
        </div>
    )
}
