import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

const homeworkTopics = [
    "Html asoslari",
    "Kirish",
    "Nodejs",
    "Takroriyash",
    "Javascript asoslari",
    "React bilan ishlash"
]

export default function GroupHomeworkCreate() {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [group, setGroup] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState("")

    const token = localStorage.getItem("token")

    const fetchGroup = async () => {
        if (!token || token === "undefined" || token === "null") {
            navigate("/")
            return
        }

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
            setGroup(data)
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

    const handleSubmit = async () => {
        if (!subject.trim()) {
            setFormError("Mavzuni tanlang")
            return
        }
        if (!description.trim()) {
            setFormError("Izoh kiriting")
            return
        }

        setFormError("")
        setSaving(true)

        try {
            const formData = new FormData()
            formData.append("title", subject)
            formData.append("description", description)
            if (file) {
                formData.append("file", file)
            }

            const response = await fetch(`${API_URL}/homework/${groupId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token.replace(/^Bearer\s+/i, '')}`
                },
                body: formData
            })

            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                setFormError(data.message || "Vazifani yaratishda xatolik yuz berdi")
                return
            }

            navigate(`/classes/groups/${groupId}`)
        } catch (err) {
            console.error("Error creating homework:", err)
            setFormError("Server bilan bog'lanishda xatolik")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 p-[24px] lg:p-[32px]">
                    <div className="max-w-[940px]">
                        <div className="flex flex-col gap-[12px] mb-[28px]">
                            <button
                                className="inline-flex items-center gap-[8px] text-gray-500 hover:text-gray-800 transition-colors"
                                onClick={() => navigate(-1)}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Orqaga
                            </button>
                            <div>
                                <p className="text-[13px] uppercase tracking-[0.24em] font-[700] text-gray-500 mb-[8px]">Yangi uyga vazifa yaratish</p>
                                <h1 className="text-[32px] font-[800] text-gray-900">Yangi uyga vazifa yaratish</h1>
                                <p className="text-[15px] text-gray-500 mt-[6px]">Guruh uchun yangi uyga vazifa yaratib, talabalar uchun e'lon qiling.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-[32px] space-y-[24px]">
                                <div>
                                    <label className="block text-[14px] font-[700] text-gray-800 mb-[10px]">* Mavzu</label>
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full rounded-[18px] border border-gray-200 bg-white px-[18px] py-[14px] text-gray-800 outline-none focus:border-teal-500"
                                    >
                                        <option value="">Mavzulardan birini tanlang</option>
                                        {homeworkTopics.map((topic, index) => (
                                            <option key={index} value={topic}>{topic}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[14px] font-[700] text-gray-800 mb-[10px]">* Izoh</label>
                                    <div className="rounded-[18px] border border-gray-200 overflow-hidden">
                                        <div className="bg-gray-50 px-[16px] py-[12px] flex flex-wrap items-center gap-[10px] border-b border-gray-200">
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-[12px] font-[700] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">H1</button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-[12px] font-[700] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">H2</button>
                                            <div className="flex items-center gap-[6px] border border-gray-200 rounded-[10px] bg-white px-[12px] py-[8px] text-[13px] text-gray-600">
                                                <span>Sans Serif</span>
                                                <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                            </div>
                                            <div className="flex items-center gap-[6px] border border-gray-200 rounded-[10px] bg-white px-[12px] py-[8px] text-[13px] text-gray-600">
                                                <span>Normal</span>
                                                <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                            </div>
                                            <button className="px-[10px] py-[6px] rounded-[10px] font-[700] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">B</button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] font-[700] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">I</button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] font-[700] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">U</button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] font-[700] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">S</button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"><i className="fa-solid fa-quote-left"></i></button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"><i className="fa-solid fa-code"></i></button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"><i className="fa-solid fa-list-ul"></i></button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"><i className="fa-solid fa-list-ol"></i></button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"><i className="fa-solid fa-align-left"></i></button>
                                            <button className="px-[10px] py-[6px] rounded-[10px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"><i className="fa-solid fa-link"></i></button>
                                        </div>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={10}
                                            placeholder="Vazifa haqida batafsil ma'lumot kiriting..."
                                            className="w-full resize-none border-none px-[18px] py-[18px] text-gray-700 placeholder:text-gray-400 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="border border-dashed border-gray-200 rounded-[18px] py-[32px] text-center">
                                    <div className="flex flex-col items-center gap-[12px] justify-center">
                                        <div className="w-[56px] h-[56px] rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-[24px]">
                                            <i className="fa-solid fa-cloud-arrow-up"></i>
                                        </div>
                                        <p className="text-[15px] font-[700] text-gray-700">Faylni tanlash yoki shu yerga tashlang</p>
                                        <label className="inline-flex items-center justify-center rounded-[14px] bg-white border border-gray-200 px-[18px] py-[12px] text-[14px] font-[700] text-gray-700 cursor-pointer hover:bg-gray-50">
                                            Fayl tanlash
                                            <input type="file" accept="*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                        {file && (
                                            <p className="text-[13px] text-gray-500">Tanlangan fayl: {file.name}</p>
                                        )}
                                    </div>
                                </div>

                                {formError && (
                                    <div className="text-red-500 font-[600]">{formError}</div>
                                )}

                                <div className="flex flex-col gap-[12px] sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        className="w-full sm:w-auto px-[24px] py-[14px] rounded-[16px] border border-gray-200 text-gray-700 font-[700] hover:bg-gray-50 transition-colors"
                                        onClick={() => navigate(-1)}
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full sm:w-auto px-[24px] py-[14px] rounded-[16px] bg-teal-500 text-white font-[700] hover:bg-teal-600 transition-colors"
                                        onClick={handleSubmit}
                                        disabled={saving}
                                    >
                                        E'lon qilish
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
