import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

const homeworkTopics = [
    "HTML asoslari",
    "CSS asoslari",
    "JavaScript kirish",
    "JavaScript funksiyalar",
    "DOM manipulyatsiya",
    "React kirish",
    "React hooks",
    "React Router",
    "Node.js asoslari",
    "Express.js",
    "Ma'lumotlar bazasi",
    "Git va GitHub",
    "Loyiha yaratish",
    "Takrorlash",
    "Boshqa"
]

export default function GroupHomeworkCreate() {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [group, setGroup] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)
    const [lessonDate, setLessonDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [lessonId, setLessonId] = useState("")
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [dragOver, setDragOver] = useState(false)
    const [lessons, setLessons] = useState([])
    const [lessonsLoading, setLessonsLoading] = useState(false)

    const getToken = () => localStorage.getItem("token") || ""

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

    const fetchLessons = async () => {
        const token = getToken()
        if (!token || token === "undefined" || token === "null") return
        setLessonsLoading(true)
        try {
            const headers = { "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}` }
            
            // Birinchi /lessons/my/group/:groupId ga urinamiz
            let res = await fetch(`${API_URL}/lessons/my/group/${groupId}`, { headers })
            if (res.ok) {
                const data = await res.json()
                const list = findArray(data)
                console.log("📖 Lessons from /lessons/my/group:", list)
                if (list.length > 0) {
                    setLessons(list)
                    setLessonsLoading(false)
                    return
                }
            }

            // Agar bo'sh bo'lsa, /homework/:groupId dan topic larni olamiz
            res = await fetch(`${API_URL}/homework/${groupId}`, { headers })
            if (res.ok) {
                const data = await res.json()
                const list = findArray(data)
                console.log("📖 Lessons from /homework:", list)
                setLessons(list)
            }
        } catch (err) {
            console.error("Lessons fetch error:", err)
        } finally {
            setLessonsLoading(false)
        }
    }

    const fetchGroup = async () => {
        const token = getToken()
        if (!token || token === "undefined" || token === "null") {
            navigate("/")
            return
        }
        console.log("[fetchGroup] Token:", token)

        setLoading(true)
        setError("")

        try {
            const response = await fetch(`${API_URL}/groups/${groupId}`, {
                headers: {
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                }
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token")
                    navigate("/")
                    return
                }
                throw new Error(data.message || "Guruh ma'lumotlarini olishda xatolik yuz berdi")
            }
            setGroup(data?.data || data)
        } catch (err) {
            console.error("Error fetching group:", err)
            setError(err.message || "Server bilan bog'lanishda xatolik")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGroup()
        fetchLessons()
    }, [groupId])

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) setFile(selectedFile)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) setFile(droppedFile)
    }

    const handleSubmit = async () => {
        const token = getToken()
        if (!token || token === "undefined" || token === "null") {
            navigate("/")
            return
        }

        if (!title.trim()) {
            setFormError("Mavzuni tanlang yoki kiriting")
            return
        }
        if (!description.trim()) {
            setFormError("Izoh kiriting")
            return
        }
        if (!lessonId) {
            setFormError("Dars ID sini kiriting")
            return
        }

        setFormError("")
        setSuccessMsg("")
        setSaving(true)

        const cleanToken = token.replace(/^Bearer\s+/i, '').trim()
        console.log("[handleSubmit] Token:", cleanToken)

        try {
            let response

            if (file) {
                // Fayl bor bo'lsa — multipart/form-data
                const formData = new FormData()
                formData.append("title", title.trim())
                formData.append("description", description.trim())
                formData.append("group_id", groupId)
                formData.append("lesson_id", Number(lessonId))
                if (lessonDate) formData.append("lesson_date", lessonDate)
                if (endDate) formData.append("end_date", endDate)
                formData.append("file", file)

                response = await fetch(`${API_URL}/homework`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${cleanToken}` },
                    body: formData
                })
            } else {
                // Fayl yo'q — JSON yuborish
                const body = {
                    title: title.trim(),
                    description: description.trim(),
                    group_id: Number(groupId),
                    lesson_id: Number(lessonId)
                }
                if (lessonDate) body.lesson_date = lessonDate
                if (endDate) body.end_date = endDate

                response = await fetch(`${API_URL}/homework`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${cleanToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
            }

            const data = await response.json().catch(() => ({}))
            console.log("[handleSubmit] Status:", response.status, "| Data:", JSON.stringify(data))

            if (response.status === 401) {
                localStorage.removeItem("token")
                navigate("/")
                return
            }

            if (!response.ok || data.success === false || data.error) {
                setFormError(data.message || data.error || `Xatolik yuz berdi. Status: ${response.status}. API javobi: ${JSON.stringify(data)}`)
                setSaving(false)
                return
            }

            setSuccessMsg("Uyga vazifa muvaffaqiyatli yaratildi! " + JSON.stringify(data))
            setTimeout(() => {
                navigate(`/classes/groups/${groupId}?tab=lessons`)
            }, 3000)
        } catch (err) {
            console.error("Error creating homework:", err)
            setFormError("Server bilan bog'lanishda xatolik")
        } finally {
            setSaving(false)
        }
    }

    const groupName = group?.name || group?.title || "Guruh"
    const courseName = group?.course?.name || group?.course || ""

    return (
        <div className="w-full bg-[#f4f4f5] min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <div className="w-full max-w-[800px] mt-[20px]">

                        {/* Sarlavha / Header */}
                        <div className="flex items-center gap-[12px] mb-[32px]">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="text-gray-900 hover:text-gray-600 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-left text-[20px] font-[800]"></i>
                            </button>
                            <h1 className="text-[24px] font-[800] text-gray-900 tracking-tight">Yangi uyga vazifa yaratish</h1>
                        </div>

                        {loading && (
                            <div className="p-[32px] text-center text-gray-400 font-[600]">
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Yuklanmoqda...
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-[12px] p-[16px] text-red-600 font-[600] mb-[20px]">
                                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                                {error}
                            </div>
                        )}

                        {!loading && (
                            <div className="space-y-[24px]">

                                {/* Mavzu */}
                                <div>
                                    <label className="block text-[15px] font-[700] text-gray-800 mb-[10px]">
                                        Mavzu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className={`w-full appearance-none px-[20px] py-[16px] rounded-[8px] border border-gray-200 outline-none text-[15px] bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm ${!title ? 'text-gray-500' : 'text-gray-900'}`}
                                        >
                                            <option value="" disabled>Mavzulardan birini tanlang</option>
                                            {homeworkTopics.map((topic, index) => (
                                                <option key={index} value={topic}>{topic}</option>
                                            ))}
                                        </select>
                                        <i className="fa-solid fa-chevron-down absolute right-[20px] top-1/2 -translate-y-1/2 text-gray-600 text-[14px] pointer-events-none"></i>
                                    </div>
                                    {!homeworkTopics.includes(title) && title && (
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Mavzu nomini kiriting..."
                                            className="w-full mt-[12px] rounded-[8px] border border-gray-200 bg-white px-[20px] py-[16px] text-gray-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm text-[15px]"
                                        />
                                    )}
                                </div>

                                {/* Dars tanlash yoki kiritish */}
                                <div>
                                    <label className="block text-[15px] font-[700] text-gray-800 mb-[10px]">
                                        Dars ID <span className="text-red-500">*</span>
                                    </label>
                                    
                                    {lessons.length > 0 ? (
                                        <div className="relative">
                                            <select
                                                value={lessonId}
                                                onChange={(e) => setLessonId(e.target.value)}
                                                className={`w-full appearance-none px-[20px] py-[16px] rounded-[8px] border border-gray-200 outline-none text-[15px] bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm ${!lessonId ? 'text-gray-500' : 'text-gray-900'}`}
                                            >
                                                <option value="" disabled>Darsni tanlang</option>
                                                {lessons.map((l, index) => (
                                                    <option key={l.id || l._id || index} value={l.id || l._id || index}>
                                                        {l.topic || l.title || l.name || `Dars ${index + 1}`} (ID: {l.id || l._id || index})
                                                    </option>
                                                ))}
                                                <option value="custom">Boshqa (Qo'lda kiritish)</option>
                                            </select>
                                            <i className="fa-solid fa-chevron-down absolute right-[20px] top-1/2 -translate-y-1/2 text-gray-600 text-[14px] pointer-events-none"></i>
                                        </div>
                                    ) : (
                                        <input
                                            type="number"
                                            value={lessonId}
                                            onChange={(e) => setLessonId(e.target.value)}
                                            placeholder="Dars ID sini kiriting (masalan: 1, 2, 3...)"
                                            className="w-full rounded-[8px] border border-gray-200 bg-white px-[20px] py-[16px] text-gray-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm text-[15px]"
                                        />
                                    )}

                                    {lessonId === 'custom' && (
                                        <input
                                            type="number"
                                            onChange={(e) => setLessonId(e.target.value)}
                                            placeholder="Dars ID sini kiriting (masalan: 1, 2, 3...)"
                                            className="w-full mt-[12px] rounded-[8px] border border-gray-200 bg-white px-[20px] py-[16px] text-gray-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm text-[15px]"
                                        />
                                    )}
                                    <p className="mt-[8px] text-[13px] text-gray-500 font-[500]">Bu vazifa qaysi darsga tegishli ekanligini bildiradi.</p>
                                </div>

                                {/* Izoh */}
                                <div>
                                    <label className="block text-[15px] font-[700] text-gray-800 mb-[10px]">
                                        Izoh <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        rows="6"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Vazifa haqida qo'shimcha ma'lumot kiriting..."
                                        className="w-full border border-gray-200 rounded-[8px] px-[20px] py-[20px] outline-none resize-y text-[15px] text-gray-900 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm placeholder:text-gray-400"
                                    ></textarea>
                                </div>

                                {/* Yuklash / Upload fayl */}
                                <div>
                                    <label 
                                        className={`flex flex-col items-center justify-center w-full py-[36px] border-[2px] border-dashed rounded-[10px] cursor-pointer transition-colors bg-white ${dragOver ? 'border-[#8B5CF6] bg-purple-50' : 'border-gray-300 hover:border-[#8B5CF6]'}`}
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                    >
                                        <i className="fa-solid fa-cloud-arrow-up text-[#8B5CF6] text-[32px] mb-[16px]"></i>
                                        <span className="text-[15px] font-[500] text-gray-500">
                                            {file ? file.name : 'Faylni tanlash yoki shu yerga tashlang'}
                                        </span>
                                        <input type="file" onChange={handleFileChange} className="hidden" />
                                    </label>
                                    {file && (
                                        <div className="flex justify-center mt-[12px]">
                                            <button 
                                                type="button" 
                                                onClick={() => setFile(null)}
                                                className="text-[14px] text-red-500 font-[600] hover:underline"
                                            >
                                                Faylni bekor qilish
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Xatolik xabari */}
                                {formError && (
                                    <div className="flex items-center justify-center gap-[10px] bg-red-50 border border-red-200 rounded-[10px] px-[16px] py-[14px] text-red-600 font-[600] text-[15px]">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        {formError}
                                    </div>
                                )}

                                {/* Muvaffaqiyat xabari */}
                                {successMsg && (
                                    <div className="flex items-center justify-center gap-[10px] bg-green-50 border border-green-200 rounded-[10px] px-[16px] py-[14px] text-green-700 font-[600] text-[15px]">
                                        <i className="fa-solid fa-circle-check"></i>
                                        {successMsg}
                                    </div>
                                )}

                                {/* Tugmalar / Actions */}
                                <div className="flex items-center gap-[20px] pt-[12px]">
                                    <button 
                                        type="button" 
                                        onClick={() => navigate(-1)}
                                        disabled={saving}
                                        className="flex-1 py-[16px] border border-gray-200 bg-white rounded-[10px] text-gray-700 font-[700] text-[16px] hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Bekor qilish
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleSubmit}
                                        disabled={saving}
                                        className="flex-1 py-[16px] bg-[#10b981] text-white rounded-[10px] font-[700] text-[16px] hover:bg-[#059669] transition-colors disabled:opacity-70 flex items-center justify-center gap-[10px] shadow-sm"
                                    >
                                        {saving && <i className="fa-solid fa-spinner fa-spin"></i>}
                                        E'lon qilish
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
