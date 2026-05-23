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
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [dragOver, setDragOver] = useState(false)

    const getToken = () => localStorage.getItem("token") || ""

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
                    group_id: groupId,
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

            if (!response.ok) {
                setFormError(data.message || `Xatolik: ${response.status}`)
                return
            }

            setSuccessMsg("✅ Uyga vazifa muvaffaqiyatli yaratildi!")
            setTimeout(() => {
                navigate(`/classes/groups/${groupId}?tab=lessons`)
            }, 1500)
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
        <div className="min-h-screen bg-slate-50">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 p-[24px] lg:p-[32px]">
                    <div className="max-w-[860px]">

                        {/* Breadcrumb & Back */}
                        <div className="flex flex-col gap-[12px] mb-[28px]">
                            <button
                                className="inline-flex items-center gap-[8px] text-gray-500 hover:text-gray-800 transition-colors text-[14px] font-[600] w-fit"
                                onClick={() => navigate(-1)}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Orqaga
                            </button>
                            <div>
                                <p className="text-[12px] uppercase tracking-[0.2em] font-[700] text-teal-500 mb-[6px]">
                                    {groupName} {courseName && `· ${courseName}`}
                                </p>
                                <h1 className="text-[28px] font-[800] text-gray-900">Yangi uyga vazifa yaratish</h1>
                                <p className="text-[14px] text-gray-500 mt-[6px]">
                                    Guruh uchun yangi uyga vazifa yaratib, talabalar uchun e'lon qiling.
                                </p>
                            </div>
                        </div>

                        {loading && (
                            <div className="bg-white rounded-[16px] border border-gray-200 p-[32px] text-center text-gray-400 font-[600]">
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
                            <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-[32px] py-[28px] border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
                                    <h2 className="text-[16px] font-[800] text-gray-800">
                                        <i className="fa-solid fa-book-open text-teal-500 mr-[10px]"></i>
                                        Vazifa ma'lumotlari
                                    </h2>
                                </div>

                                <div className="p-[32px] space-y-[22px]">

                                    {/* Mavzu */}
                                    <div>
                                        <label className="block text-[13px] font-[700] text-gray-700 mb-[8px]">
                                            <span className="text-red-500 mr-1">*</span>Mavzu
                                        </label>
                                        <select
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full rounded-[12px] border border-gray-200 bg-white px-[16px] py-[13px] text-gray-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-50 transition-all text-[14px] font-[500]"
                                        >
                                            <option value="">Mavzulardan birini tanlang</option>
                                            {homeworkTopics.map((topic, index) => (
                                                <option key={index} value={topic}>{topic}</option>
                                            ))}
                                        </select>
                                        <p className="text-[12px] text-gray-400 mt-[6px]">
                                            Yoki quyida o'zingiz kiriting:
                                        </p>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Mavzu nomini kiriting..."
                                            className="w-full mt-[8px] rounded-[12px] border border-gray-200 bg-white px-[16px] py-[13px] text-gray-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-50 transition-all text-[14px] font-[500]"
                                        />
                                    </div>

                                    {/* Sana maydonlari */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                                        <div>
                                            <label className="block text-[13px] font-[700] text-gray-700 mb-[8px]">
                                                Dars sanasi
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={lessonDate}
                                                onChange={(e) => setLessonDate(e.target.value)}
                                                className="w-full rounded-[12px] border border-gray-200 bg-white px-[16px] py-[13px] text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-50 transition-all text-[14px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-[700] text-gray-700 mb-[8px]">
                                                Tugash muddati
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full rounded-[12px] border border-gray-200 bg-white px-[16px] py-[13px] text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-50 transition-all text-[14px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Izoh / Description */}
                                    <div>
                                        <label className="block text-[13px] font-[700] text-gray-700 mb-[8px]">
                                            <span className="text-red-500 mr-1">*</span>Izoh
                                        </label>
                                        <div className="rounded-[12px] border border-gray-200 overflow-hidden focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all">
                                            <div className="bg-gray-50 px-[16px] py-[10px] flex flex-wrap items-center gap-[6px] border-b border-gray-200">
                                                {["H1", "H2", "B", "I", "U", "S"].map(btn => (
                                                    <button key={btn} type="button" className="px-[9px] py-[5px] rounded-[8px] text-[12px] font-[700] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                                                        {btn}
                                                    </button>
                                                ))}
                                                <div className="flex items-center gap-[4px] border border-gray-200 rounded-[8px] bg-white px-[10px] py-[6px] text-[12px] text-gray-600">
                                                    <span>Sans Serif</span>
                                                    <i className="fa-solid fa-chevron-down text-[9px]"></i>
                                                </div>
                                                {[
                                                    { icon: "fa-quote-left" },
                                                    { icon: "fa-code" },
                                                    { icon: "fa-list-ul" },
                                                    { icon: "fa-list-ol" },
                                                    { icon: "fa-align-left" },
                                                    { icon: "fa-link" }
                                                ].map(({ icon }, idx) => (
                                                    <button key={idx} type="button" className="px-[9px] py-[5px] rounded-[8px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                                                        <i className={`fa-solid ${icon} text-[12px]`}></i>
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={8}
                                                placeholder="Vazifa haqida batafsil ma'lumot kiriting..."
                                                className="w-full resize-none border-none px-[18px] py-[16px] text-gray-700 placeholder:text-gray-400 outline-none text-[14px] leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    {/* Fayl yuklash */}
                                    <div>
                                        <label className="block text-[13px] font-[700] text-gray-700 mb-[8px]">
                                            Fayl biriktirish <span className="text-gray-400 font-[400]">(Ixtiyoriy)</span>
                                        </label>
                                        <div
                                            className={`border-2 border-dashed rounded-[14px] py-[28px] text-center transition-all ${dragOver ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                                            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={handleDrop}
                                        >
                                            <div className="flex flex-col items-center gap-[10px]">
                                                <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[20px] transition-colors ${dragOver ? 'bg-teal-100 text-teal-600' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-[700] text-gray-700">
                                                        Faylni bu yerga tashlang
                                                    </p>
                                                    <p className="text-[12px] text-gray-400 mt-[2px]">yoki</p>
                                                </div>
                                                <label className="inline-flex items-center gap-[8px] justify-center rounded-[10px] bg-white border border-gray-200 px-[16px] py-[10px] text-[13px] font-[700] text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <i className="fa-solid fa-folder-open text-teal-500"></i>
                                                    Fayl tanlash
                                                    <input type="file" accept="*" onChange={handleFileChange} className="hidden" />
                                                </label>
                                                {file && (
                                                    <div className="flex items-center gap-[8px] bg-teal-50 border border-teal-200 rounded-[8px] px-[14px] py-[8px] mt-[4px]">
                                                        <i className="fa-solid fa-file text-teal-500 text-[14px]"></i>
                                                        <span className="text-[13px] font-[600] text-teal-700 max-w-[300px] truncate">{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFile(null)}
                                                            className="ml-[4px] text-teal-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <i className="fa-solid fa-xmark text-[12px]"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Xatolik xabari */}
                                    {formError && (
                                        <div className="flex items-center gap-[10px] bg-red-50 border border-red-200 rounded-[10px] px-[16px] py-[12px] text-red-600 font-[600] text-[14px]">
                                            <i className="fa-solid fa-circle-exclamation"></i>
                                            {formError}
                                        </div>
                                    )}

                                    {/* Muvaffaqiyat xabari */}
                                    {successMsg && (
                                        <div className="flex items-center gap-[10px] bg-green-50 border border-green-200 rounded-[10px] px-[16px] py-[12px] text-green-700 font-[600] text-[14px]">
                                            <i className="fa-solid fa-circle-check"></i>
                                            {successMsg}
                                        </div>
                                    )}

                                    {/* Tugmalar */}
                                    <div className="flex flex-col gap-[10px] sm:flex-row sm:justify-end pt-[8px] border-t border-gray-100">
                                        <button
                                            type="button"
                                            className="w-full sm:w-auto px-[24px] py-[13px] rounded-[12px] border border-gray-200 text-gray-700 font-[700] hover:bg-gray-50 transition-colors text-[14px]"
                                            onClick={() => navigate(-1)}
                                            disabled={saving}
                                        >
                                            Bekor qilish
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full sm:w-auto px-[28px] py-[13px] rounded-[12px] bg-teal-500 text-white font-[700] hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-[14px] flex items-center justify-center gap-[8px]"
                                            onClick={handleSubmit}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                    Saqlanmoqda...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-paper-plane"></i>
                                                    E'lon qilish
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
