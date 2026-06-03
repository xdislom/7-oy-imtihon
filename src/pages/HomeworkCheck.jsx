import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

export default function HomeworkCheck() {
    const { groupId, homeworkId, studentId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [score, setScore] = useState(60)
    const [comment, setComment] = useState("")
    const [files, setFiles] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchingAnswer, setFetchingAnswer] = useState(false)
    const [answerData, setAnswerData] = useState(null)
    const [toast, setToast] = useState(null)

    const token = localStorage.getItem("token")
    const [lessonData, setLessonData] = useState(location.state?.lesson || null)
    const activeTab = location.state?.activeTab || "PENDING"
    const stateStudent = location.state?.student || {}

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
        const fetchAnswer = async () => {
            if (!token || !groupId || !homeworkId || !studentId) return
            setFetchingAnswer(true)
            try {
                const tok = token.replace(/^Bearer\s+/i, '').trim()
                const res = await fetch(
                    `${API_URL}/group/${groupId}/homework/${homeworkId}/result/${studentId}`,
                    { headers: { 'Authorization': `Bearer ${tok}` } }
                )
                if (res.ok) {
                    const data = await res.json()
                    setAnswerData(data?.data || data)
                }
            } catch (err) {
                console.error("Error fetching answer:", err)
            } finally {
                setFetchingAnswer(false)
            }
        }
        if (activeTab !== "UNSUBMITTED") {
            fetchAnswer()
        }
    }, [studentId, groupId, homeworkId, token, activeTab])

    const student = answerData || stateStudent

    const lesson = lessonData || {}
    const homeworkTitle = lesson.title || lesson.topic || lesson.name || lesson.subject || lesson.description || "Uyga vazifa"
    const firstName = student.student?.first_name || student.first_name || ""
    const lastName = student.student?.last_name || student.last_name || ""
    const trimmedName = `${firstName} ${lastName}`.trim()
    const studentName = student.student?.full_name || student.full_name || (trimmedName ? trimmedName : (student.student?.name || student.name || "O'quvchi"))

    const submittedFiles = student.files || student.attachments || []
    const studentComment = student.comment || student.description || student.link || ""
    const submittedAt = student.created_at || student.submitted_at || null
    const fileCount = submittedFiles.length || student.files_count || 0

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

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const goBack = () => {
        const base = location.pathname.includes('/dashboard') ? '/dashboard' : '/classes'
        navigate(`${base}/groups/${groupId}/homework/${homeworkId}/results`, {
            state: { lesson }
        })
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFiles = Array.from(e.dataTransfer.files)
        setFiles(prev => [...prev, ...droppedFiles])
    }

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files)
        setFiles(prev => [...prev, ...selectedFiles])
    }

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (status = "ACCEPTED") => {
        if (!token) return
        setLoading(true)
        try {
            const tok = token.replace(/^Bearer\s+/i, '').trim()

            const answerId = student.homework_answer_id || student.answer_id || (student.student ? student.id || student._id : student.id || student._id);
            
            const payload = {
                grade: Number(score),
                title: comment || "Baholandi",
                homework_answer_id: Number(answerId),
                status: status
            }

            console.log("🚀 Yuborilayotgan ma'lumot (Payload):", payload)
            console.log("📦 To'liq O'quvchi (Student) obyekti:", student)

            const res = await fetch(`${API_URL}/group/${groupId}/homework/${homeworkId}/check`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tok}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                showToast('success', `${studentName} ga ${score} ball berildi!`)
                setTimeout(() => goBack(), 1500)
            } else {
                const data = await res.json().catch(() => ({}))
                showToast('error', data.message || "Baholashda xatolik yuz berdi")
            }
        } catch (err) {
            console.error(err)
            showToast('error', "Server bilan bog'lanishda xatolik")
        } finally {
            setLoading(false)
        }
    }

    const tabLabel = {
        PENDING: "Kutayotganlar",
        ACCEPTED: "Qabul qilinganlar",
        REJECTED: "Qaytarilganlar",
        UNSUBMITTED: "Bajarilmagan"
    }

    const statusBadge = {
        PENDING: { label: "Kutayabti", cls: "bg-yellow-50 text-yellow-600 border-yellow-200" },
        ACCEPTED: { label: "Qabul qilindi", cls: "bg-green-50 text-green-600 border-green-200" },
        REJECTED: { label: "Qaytarildi", cls: "bg-red-50 text-red-600 border-red-200" },
        UNSUBMITTED: { label: "Bajarilmagan", cls: "bg-gray-50 text-gray-500 border-gray-200" },
    }
    const badge = statusBadge[activeTab] || statusBadge.PENDING

    return (
        <div className="w-full bg-[#f3f4f6] min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <main className="mt-[24px]">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-[8px] mb-[24px]">
                            <button
                                onClick={goBack}
                                className="text-gray-500 hover:text-gray-800 font-[600] text-[15px] transition-colors"
                            >
                                {tabLabel[activeTab] || "Natijalar"}
                            </button>
                            <i className="fa-solid fa-chevron-right text-[12px] text-gray-400"></i>
                            <span className="text-[#4f46e5] font-[600] text-[15px]">Uyga vazifa</span>
                        </div>

                        <div className="flex flex-col gap-[24px] max-w-[800px]">

                            {/* LEFT COLUMN — Student Submission */}
                            <div className="flex flex-col gap-[16px]">

                                {/* Uy vazifasi card */}
                                <div className="bg-white rounded-[16px] border border-gray-200 p-[24px]">
                                    <h2 className="text-[18px] font-[700] text-gray-900 mb-[16px]">Uy vazifasi</h2>
                                    <p className="text-[13px] text-gray-400 font-[500] mb-[4px]">Izoh:</p>
                                    <p className="text-[15px] text-gray-700 font-[500]">{homeworkTitle}</p>
                                </div>

                                {/* Student card */}
                                <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden">
                                    {/* Student name header */}
                                    <div className="px-[24px] py-[20px] border-b border-gray-100">
                                        <h3 className="text-[20px] font-[800] text-gray-900">{studentName}</h3>
                                    </div>

                                    {/* Info row */}
                                    <div className="px-[24px] py-[16px] border-b border-gray-100 bg-gray-50/50">
                                        <div className="flex flex-wrap gap-[32px]">
                                            <div>
                                                <p className="text-[12px] text-gray-400 font-[500] mb-[4px]">Vaqti:</p>
                                                <p className="text-[14px] font-[700] text-gray-800">{formatDateTime(submittedAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-gray-400 font-[500] mb-[4px]">Fayllar soni:</p>
                                                <p className="text-[14px] font-[700] text-gray-800">{fileCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-gray-400 font-[500] mb-[4px]">Status:</p>
                                                <span className={`text-[12px] font-[600] px-[12px] py-[4px] rounded-full border ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Files preview */}
                                    {submittedFiles.length > 0 && (
                                        <div className="px-[24px] py-[16px] border-b border-gray-100">
                                            <p className="text-[13px] text-gray-500 font-[500] mb-[12px]">
                                                Fayl: <strong className="text-gray-700">{submittedFiles.length}</strong>
                                            </p>
                                            <div className="flex flex-wrap gap-[10px]">
                                                {submittedFiles.map((file, i) => {
                                                    const url = file?.url || file?.path || file?.link || (typeof file === 'string' ? file : null)
                                                    if (!url) return null;
                                                    const isImage = typeof url === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
                                                    return (
                                                        <a key={i} href={url} target="_blank" rel="noreferrer"
                                                            className="block w-[90px] h-[90px] rounded-[10px] overflow-hidden border border-gray-200 bg-gray-50 hover:opacity-80 transition-opacity"
                                                        >
                                                            {isImage ? (
                                                                <img src={url} alt={`file-${i}`} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <i className="fa-regular fa-file text-[28px]"></i>
                                                                </div>
                                                            )}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Student comment / link */}
                                    {studentComment && (
                                        <div className="px-[24px] py-[16px]">
                                            <div className="border-l-[4px] border-[#4f46e5] pl-[16px] py-[4px] bg-gray-50 rounded-r-[8px]">
                                                <p className="text-[12px] text-gray-400 font-[500] mb-[4px]">Uyga vazifa izohi:</p>
                                                {studentComment.startsWith('http') ? (
                                                    <a href={studentComment} target="_blank" rel="noreferrer"
                                                        className="text-[14px] text-[#4f46e5] font-[500] break-all hover:underline"
                                                    >
                                                        {studentComment}
                                                    </a>
                                                ) : (
                                                    <p className="text-[14px] text-gray-700 font-[500] break-all">{studentComment}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN — Grading Form */}
                            <div className="flex flex-col gap-[16px]">

                                {/* Info alert */}
                                <div className="flex items-start gap-[12px] bg-blue-50 border border-blue-200 rounded-[14px] p-[16px]">
                                    <i className="fa-solid fa-circle-info text-blue-500 text-[18px] mt-[2px] shrink-0"></i>
                                    <p className="text-[14px] text-blue-700 font-[500] leading-relaxed">
                                        60-100 oralig'ida ball qo'yilgan vazifa <strong>'Qabul qilingan'</strong>, 0-59 oralig'ida ball qo'yilgan vazifa <strong>'Qaytarilgan'</strong> hisoblanadi.
                                    </p>
                                </div>

                                {/* Score slider */}
                                <div className="bg-white rounded-[16px] border border-gray-200 p-[24px]">
                                    <h4 className="text-[16px] font-[700] text-gray-900 mb-[20px]">Ball</h4>
                                    <div className="flex items-center gap-[16px]">
                                        <div className="flex-1 relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={score}
                                                onChange={(e) => setScore(Number(e.target.value))}
                                                className="w-full h-[6px] rounded-full appearance-none cursor-pointer score-slider"
                                                style={{
                                                    background: `linear-gradient(to right, ${score >= 60 ? '#22c55e' : '#ef4444'} ${score}%, #e5e7eb ${score}%)`
                                                }}
                                            />
                                            <div className="text-center text-[12px] text-gray-400 mt-[8px] font-[500]">O'tish bali</div>
                                        </div>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            min="0"
                                            max="100"
                                            value={score}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/^0+(?=\d)/, '')
                                                const val = Math.min(100, Math.max(0, Number(raw) || 0))
                                                setScore(val)
                                            }}
                                            className="w-[64px] h-[44px] border border-gray-200 rounded-[10px] text-center text-[16px] font-[700] text-gray-800 outline-none focus:border-indigo-400"
                                        />
                                    </div>

                                    {/* Score indicator */}
                                    <div className={`mt-[12px] text-center text-[13px] font-[600] px-[12px] py-[6px] rounded-[8px] ${score >= 60 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        {score >= 60 ? '✓ Qabul qilinadi' : '✗ Qaytariladi'}
                                    </div>
                                </div>

                                {/* Teacher file upload */}
                                <div className="bg-white rounded-[16px] border border-gray-200 p-[24px]">
                                    <h4 className="text-[16px] font-[700] text-gray-900 mb-[16px]">Fayllar</h4>
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('hw-file-input').click()}
                                        className={`border-2 border-dashed rounded-[14px] p-[32px] flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragging ? 'border-teal-400 bg-teal-50' : 'border-teal-300 bg-teal-50/40 hover:bg-teal-50'}`}
                                    >
                                        <i className="fa-solid fa-cloud-arrow-up text-teal-500 text-[36px] mb-[12px]"></i>
                                        <p className="text-[15px] font-[600] text-gray-700 mb-[4px]">
                                            Faylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                                        </p>
                                        <p className="text-[12px] text-gray-400 font-[400]">
                                            .jpg, .png, .pdf, .mp4, .docs formatlaridan birida bo'lishi mumkin
                                        </p>
                                        <input
                                            id="hw-file-input"
                                            type="file"
                                            multiple
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.pdf,.mp4,.doc,.docx"
                                            onChange={handleFileInput}
                                        />
                                    </div>

                                    {/* Uploaded file list */}
                                    {files.length > 0 && (
                                        <div className="mt-[12px] flex flex-col gap-[8px]">
                                            {files.map((file, i) => (
                                                <div key={i} className="flex items-center justify-between gap-[8px] px-[12px] py-[8px] bg-gray-50 rounded-[8px] border border-gray-100">
                                                    <div className="flex items-center gap-[8px]">
                                                        <i className="fa-regular fa-file text-gray-400"></i>
                                                        <span className="text-[13px] font-[500] text-gray-700 truncate max-w-[220px]">{file.name}</span>
                                                    </div>
                                                    <button onClick={() => removeFile(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                        <i className="fa-solid fa-xmark text-[14px]"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Teacher comment */}
                                <div className="bg-white rounded-[16px] border border-gray-200 p-[24px]">
                                    <div className="relative">
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Izohingiz"
                                            rows={4}
                                            className="w-full resize-none outline-none text-[15px] text-gray-700 placeholder:text-gray-400 font-[400]"
                                        />
                                        <button className="absolute bottom-[4px] right-[4px] w-[40px] h-[40px] bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors shadow-sm">
                                            <i className="fa-solid fa-microphone text-white text-[16px]"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex justify-end gap-[12px] mt-[4px]">
                                    <button
                                        onClick={goBack}
                                        className="px-[28px] py-[12px] rounded-[12px] border border-gray-200 bg-white text-gray-600 font-[600] text-[14px] hover:bg-gray-50 transition-colors"
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        onClick={() => handleSubmit("REJECTED")}
                                        disabled={loading}
                                        className={`px-[28px] py-[12px] rounded-[12px] font-[600] text-[14px] border border-red-500 text-red-500 transition-all shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}`}
                                    >
                                        Qaytarish
                                    </button>
                                    <button
                                        onClick={() => handleSubmit("ACCEPTED")}
                                        disabled={loading}
                                        className={`px-[32px] py-[12px] rounded-[12px] font-[700] text-[14px] text-white transition-all shadow-sm ${loading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
                                    >
                                        {loading ? (
                                            <><i className="fa-solid fa-spinner fa-spin mr-[6px]"></i>Yuborilmoqda...</>
                                        ) : 'Qabul qilish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-[32px] right-[32px] z-[999] flex items-center gap-[12px] px-[20px] py-[14px] rounded-[14px] shadow-2xl text-white text-[14px] font-[600] ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-[18px]`}></i>
                    {toast.message}
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .score-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid #6366f1;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                .score-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid #6366f1;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
            `}} />
        </div>
    )
}
