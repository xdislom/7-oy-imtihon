import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';
import VideoPlayer from '../components/VideoPlayer';

export default function StudentLessonDetail() {
    const { groupId, lessonId } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [lessonData, setLessonData] = useState(null);
    const [homework, setHomework] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [result, setResult] = useState(null);
    const [homeworkText, setHomeworkText] = useState("");
    const [homeworkFile, setHomeworkFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [videos, setVideos] = useState([]);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [allLessons, setAllLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Fetch homeworks for this lesson
                const hwRes = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/groups/${groupId}/lessons/${lessonId}/homeworks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const hwData = await hwRes.json();
                
                // Homework comes either as an array or object
                let hwObj = null;
                let ansObj = null;
                let resObj = null;
                
                if (hwData?.data) {
                    if (hwData.data.homework) {
                        hwObj = hwData.data.homework;
                        ansObj = hwData.data.answer || null;
                        resObj = hwData.data.result || null;
                    } else if (Array.isArray(hwData.data)) {
                        hwObj = hwData.data[0];
                    } else {
                        hwObj = hwData.data;
                    }
                } else if (hwData?.homework) {
                    hwObj = hwData.homework;
                } else if (Array.isArray(hwData)) {
                    hwObj = hwData[0];
                } else {
                    hwObj = hwData;
                }
                
                setHomework(hwObj);
                setAnswer(ansObj);
                setResult(resObj);

                // Fetch videos for this lesson
                const videosRes = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/groups/${groupId}/lessons/${lessonId}/videos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const videosData = await videosRes.json();
                let vidList = [];
                if (Array.isArray(videosData)) vidList = videosData;
                else if (videosData?.data && Array.isArray(videosData.data)) vidList = videosData.data;
                else if (videosData?.videos && Array.isArray(videosData.videos)) vidList = videosData.videos;
                setVideos(vidList);

                // Fetch all lessons to show on the right side
                const lessonsRes = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/groups/${groupId}/lessons/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const lessonsData = await lessonsRes.json();
                
                let list = [];
                if (Array.isArray(lessonsData)) list = lessonsData;
                else if (lessonsData.data) list = Array.isArray(lessonsData.data) ? lessonsData.data : (lessonsData.data.lessons || []);
                
                setAllLessons(list);
                
                const current = list.find(l => String(l.id) === String(lessonId));
                if (current) setLessonData(current);
                
            } catch (err) {
                console.error("Error fetching lesson details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId, lessonId]);

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        if (isNaN(d)) return dateString;
        
        const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        const day = d.getDate();
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();
        
        if (includeTime) {
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${day} ${monthName}, ${year} ${hours}:${minutes}`;
        }
        return `${day} ${monthName}, ${year}`;
    };

    const getHwDeadline = (hw, lesson) => {
        const rawDate = hw?.created_at || hw?.date || lesson?.date || lesson?.lesson_date || lesson?.created_at;
        if (!rawDate) return '-';
        const d = new Date(rawDate);
        if (isNaN(d)) return '-';
        d.setHours(d.getHours() + 20); 
        
        const monthsStr = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
        const day = d.getDate();
        const monthName = monthsStr[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day} ${monthName}, ${year} ${hours}:${minutes}`;
    };

    const handleHomeworkSubmit = async () => {
        if (!homeworkText.trim() && !homeworkFile) return;
        if (!homework?.id) return;
        
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            
            // "title" yuboramiz - ustoz ko'radigan matn
            formData.append('title', homeworkText.trim() || 'Vazifa fayli');
            
            if (homeworkFile) {
                formData.append('file', homeworkFile);
            }
            
            const res = await fetch(`https://najot-edu.softwareengineer.uz/api/v1/students/homeworkAnswer/${homework.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (res.ok) {
                // Javob yuborilgach, sahifani yangilaymiz (yoki datani fetchData orqali yangilaymiz)
                window.location.reload();
            } else {
                const data = await res.json().catch(() => ({}));
                console.error("Submit error:", data);
                alert("Vazifani yuborishda xatolik yuz berdi: " + (data.message || res.status));
            }
        } catch (err) {
            console.error(err);
            alert("Tarmoq xatosi");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f5f5f2] font-sans">
            <div className="flex min-h-screen">
                <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar transition-all duration-300">
                    <StudentHeader
                        onMenuClick={() => setIsSidebarOpen(true)}
                        isSidebarOpen={isSidebarOpen}
                        onSidebarClose={() => setIsSidebarOpen(false)}
                    />

                    <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
                        <div className="max-w-[1300px] mx-auto flex flex-col xl:flex-row gap-6 items-start">
                            {/* LEFT COLUMN */}
                            <section className="flex-1 flex flex-col gap-4">
                                <div className="bg-white rounded-[14px] border border-[#ece9e2] shadow-sm overflow-hidden">
                                    <div className="h-[500px] sm:h-[430px] md:h-[500px] w-full bg-[#111111] relative">
                                        {loading ? (
                                            <div className="flex items-center justify-center w-full h-full">
                                                <i className="fa-solid fa-spinner animate-spin text-gray-300 text-3xl"></i>
                                            </div>
                                        ) : videos && videos.length > 0 ? (
                                            <div className="w-full h-full">
                                                <VideoPlayer
                                                    url={`https://najot-edu.softwareengineer.uz/files/files/${videos[activeVideoIndex]?.originalname || videos[activeVideoIndex]?.video_url || videos[activeVideoIndex]?.name || ''}`}
                                                    rawVideoUrl={videos[activeVideoIndex]?.video_url || videos[activeVideoIndex]?.file || videos[activeVideoIndex]?.url || videos[activeVideoIndex]?.path || videos[activeVideoIndex]?.originalname || ''}
                                                    token={localStorage.getItem('token')}
                                                    fileId={videos[activeVideoIndex]?.id || videos[activeVideoIndex]?._id}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full w-full bg-[#f8f7f3] text-center px-6">
                                                <div className="w-20 h-20 rounded-full bg-[#f7e8d0] flex items-center justify-center mb-4">
                                                    <i className="fa-solid fa-play text-[#c59c73] text-2xl"></i>
                                                </div>
                                                <h2 className="text-[#333] text-[22px] font-bold">Video mavjud emas</h2>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-[14px] border border-[#ece9e2] shadow-sm p-5 md:p-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[#8c94a3] text-[13px] font-medium">Mavzu</span>
                                        <h3 className="text-[#1f2937] text-[18px] md:text-[20px] font-semibold leading-snug">
                                            {loading ? 'Yuklanmoqda...' : (lessonData?.title || lessonData?.topic || lessonData?.name || lessonData?.subject || lessonData?.description || "Noma'lum mavzu")}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[14px] border border-[#ece9e2] shadow-sm overflow-hidden">
                                    <div className="flex items-center border-b border-[#ece9e2] px-5">
                                        <button className="py-4 text-[#c59c73] font-semibold text-[15px] border-b-2 border-[#c59c73]">
                                            Vazifalar
                                        </button>
                                    </div>

                                    <div className="p-5 md:p-6 bg-[#fbfbfb]">
                                        {loading ? (
                                            <div className="text-gray-400 py-10 text-center">Yuklanmoqda...</div>
                                        ) : homework ? (
                                            <div>
                                                <h4 className="text-[20px] font-semibold text-[#cf8e6d] mb-6 border-b pb-4">Vazifalarim</h4>
                                                <div className="flex flex-col gap-6">
                                                    
                                                    {/* Uyga vazifa qismi */}
                                                    <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                                                        <div className="flex justify-between items-start flex-wrap gap-3">
                                                            <h5 className="font-bold text-[16px] text-gray-900">Uyga vazifa</h5>
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-[#ff3b30] text-white px-4 py-1.5 rounded-[4px] flex items-center gap-2 text-[13px] font-medium">
                                                                    <i className="fa-solid fa-circle-info"></i>
                                                                    <span>Uyga vazifa muddati: {getHwDeadline(homework, lessonData)}</span>
                                                                </div>
                                                                <span className="text-[13px] text-gray-500">
                                                                    Fayllar soni: {Array.isArray(homework.files) ? homework.files.length : (homework.file ? 1 : 0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-[14px] text-gray-600">{homework.title || homework.description}</p>
                                                        
                                                        {homework.file && (
                                                            <div className="flex justify-between items-end mt-2">
                                                                <a
                                                                    href={`https://najot-edu.softwareengineer.uz/files/files/${homework.file}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-[8px] hover:border-gray-300 transition-colors"
                                                                >
                                                                    <div className="w-5 h-5 flex items-center justify-center text-[#9333ea] opacity-70">
                                                                        <i className="fa-solid fa-file-lines text-[16px]"></i>
                                                                    </div>
                                                                    <span className="text-[13px] font-medium text-gray-700 truncate max-w-[400px]">{homework.file}</span>
                                                                </a>
                                                                {homework.created_at && (
                                                                    <span className="text-[12px] text-[#c59c73]">{formatDate(homework.created_at)}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Vazifa yuborish qismi (agar javob yo'q bo'lsa) */}
                                                    {!answer && (
                                                        <div className="bg-white rounded-[4px] border border-gray-200 mt-2">
                                                            <div className="flex items-start">
                                                                <textarea 
                                                                    className="w-full resize-none outline-none text-[15px] text-gray-600 placeholder:text-gray-400 p-4 min-h-[60px]"
                                                                    placeholder="Fayl biriktiring va izoh qoldiring"
                                                                    value={homeworkText}
                                                                    onChange={(e) => setHomeworkText(e.target.value.slice(0, 1000))}
                                                                    rows={1}
                                                                />
                                                                <div className="flex items-center gap-4 shrink-0 px-4 pt-4">
                                                                    <label className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
                                                                        <i className="fa-solid fa-paperclip text-[18px]"></i>
                                                                        <input type="file" className="hidden" onChange={(e) => setHomeworkFile(e.target.files[0])} />
                                                                    </label>
                                                                    <button 
                                                                        type="button" 
                                                                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                                                        disabled={(!homeworkText.trim() && !homeworkFile) || submitting}
                                                                        onClick={handleHomeworkSubmit}
                                                                    >
                                                                        {submitting ? (
                                                                            <i className="fa-solid fa-spinner fa-spin text-[20px]"></i>
                                                                        ) : (
                                                                            <i className="fa-solid fa-paper-plane text-[20px]"></i>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {homeworkFile && (
                                                                <div className="px-4 pb-2">
                                                                    <div className="inline-flex items-center gap-2 bg-[#f9f8f4] px-3 py-1.5 rounded-[6px] border border-gray-200">
                                                                        <i className="fa-solid fa-file text-[#c59c73]"></i>
                                                                        <span className="text-[13px] text-gray-700 truncate max-w-[200px]">{homeworkFile.name}</span>
                                                                        <button onClick={() => setHomeworkFile(null)} className="text-gray-400 hover:text-red-500 ml-2">
                                                                            <i className="fa-solid fa-xmark"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="text-right px-4 pb-3 text-[13px] text-gray-500 font-medium">
                                                                {homeworkText.length} / 1000
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Mening jo'natmalarim qismi */}
                                                    {answer && (
                                                        <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                                                            <div className="flex justify-between items-start flex-wrap gap-3">
                                                                <h5 className="font-bold text-[16px] text-gray-900">Mening jo'natmalarim</h5>
                                                                <span className="text-[13px] text-gray-500">
                                                                    Fayllar soni: {answer.file ? 1 : 0}
                                                                </span>
                                                            </div>
                                                            <p className="text-[14px] text-gray-600">{answer.title || answer.description}</p>
                                                            
                                                            {answer.file && (
                                                                <div className="flex justify-between items-end mt-2">
                                                                    <a
                                                                        href={`https://najot-edu.softwareengineer.uz/files/files/${answer.file}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="inline-flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-[8px] hover:border-gray-300 transition-colors"
                                                                    >
                                                                        <div className="w-5 h-5 flex items-center justify-center text-gray-700">
                                                                            <i className="fa-regular fa-image text-[16px]"></i>
                                                                        </div>
                                                                        <span className="text-[13px] font-medium text-gray-700 truncate max-w-[400px]">{answer.file}</span>
                                                                    </a>
                                                                    {answer.created_at && (
                                                                        <span className="text-[12px] text-[#c59c73]">{formatDate(answer.created_at)}</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Kutilayotgan (Pending) holati */}
                                                    {answer && !result && (
                                                        <div className="bg-[#f0f7ff] rounded-[12px] p-6 border border-[#cce3fd]">
                                                            <div className="flex flex-col gap-3">
                                                                <i className="fa-solid fa-hourglass-half text-[20px] text-blue-500"></i>
                                                                <p className="text-[15px] text-blue-700 font-medium mb-4">Sizning vazifangiz tekshirilmoqda...</p>
                                                                <p className="text-[14px] text-blue-600 font-medium text-center border-t border-blue-100 pt-6">Qayta topshirish imkoniyati berilmagan</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Natija qismi */}
                                                    {result && (
                                                        <div className="bg-[#f2fbf5] rounded-[12px] p-6 shadow-sm border border-[#d1f4db] flex flex-col gap-4">
                                                            <div className="flex justify-between items-center">
                                                                <h5 className="font-bold text-[16px] text-[#2e7d32]">Natija: Tekshirildi</h5>
                                                                <span className="bg-[#4caf50] text-white px-3 py-1 rounded-[4px] text-[14px] font-bold">
                                                                    Baho: {result.grade}
                                                                </span>
                                                            </div>
                                                            <p className="text-[14px] text-gray-700 mt-2">
                                                                <span className="font-medium">Ustoz izohi:</span> {result.title || result.comment || "Izoh qoldirilmagan"}
                                                            </p>
                                                            {result.checker && (
                                                                <p className="text-[13px] text-gray-500 text-right mt-2">Tekshirdi: {result.checker}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 text-center py-10">Bu dars uchun uyga vazifa topilmadi.</div>
                                        )}
                                    </div>
                                </div>
                            </section>

                             {/* RIGHT COLUMN */}
                             <aside className="w-full xl:w-[360px] xl:flex-shrink-0 xl:sticky xl:top-[90px] xl:h-[calc(100vh-110px)] flex flex-col">
                                 <div className="bg-white rounded-[14px] border border-[#ece9e2] shadow-sm p-4 h-full flex flex-col overflow-hidden">
                                     <div className="flex items-center justify-between pb-3 mb-2 flex-shrink-0">
                                         <h3 className="text-[15px] font-semibold text-[#1f2937]">Darslar ro'yxati</h3>
                                         <span className="text-[12px] text-gray-500">{allLessons.length}</span>
                                     </div>

                                     <div className="flex flex-col gap-[14px] overflow-y-auto pr-[6px] custom-scrollbar flex-1 min-h-0">
                                         {allLessons.map((l, i) => {
                                             const isActive = String(l.id) === String(lessonId);
                                             const lessonVideos = Array.isArray(l.videos) ? l.videos : [];
                                             const activeVideos = isActive ? (videos?.length > 0 ? videos : lessonVideos) : [];
                                             const vCount = l.videoCount !== undefined ? l.videoCount : (lessonVideos.length || l.video_count || 0);
                                             const hasChevron = vCount > 0 || isActive;

                                             const dateVal = l.date || l.created_at;
                                             const dateDisplay = dateVal ? formatDate(dateVal) : '-';
                                             const lessonTitle = l.title || l.topic || l.name || l.lesson_name || l.subject || l.description || `Dars ${i + 1}`;

                                             return (
                                                 <div
                                                     key={l.id || i}
                                                     className={`rounded-[12px] transition-colors ${
                                                         isActive ? 'bg-[#fdfbf7] p-[10px] flex flex-col gap-2' : 'bg-[#f8f5f0] p-[10px]'
                                                     }`}
                                                 >
                                                     <div
                                                         className={`px-4 py-3.5 cursor-pointer flex items-center justify-between gap-3 transition-colors rounded-[10px] ${
                                                             isActive ? 'bg-purple-600' : 'bg-transparent hover:bg-black/5'
                                                         }`}
                                                         onClick={() => !isActive && navigate(`/dashboard/my-groups/${groupId}/lessons/${l.id}`)}
                                                     >
                                                         <div>
                                                             <h4 className={`text-[15px] font-[700] leading-snug ${isActive ? 'text-white' : 'text-black'}`}>
                                                                 {lessonTitle}
                                                             </h4>
                                                             <p className={`text-[13px] mt-[4px] ${isActive ? 'text-purple-100' : 'text-gray-600'}`}>
                                                                 Dars sanasi: {dateDisplay}
                                                             </p>
                                                         </div>
                                                         {hasChevron && (
                                                             <i className={`fa-solid fa-chevron-down text-[13px] ${isActive ? 'rotate-180 text-white' : 'text-gray-500'} transition-transform duration-200`}></i>
                                                         )}
                                                     </div>

                                                     {isActive && activeVideos.length > 0 && (
                                                         <div className="flex flex-col gap-2">
                                                             {activeVideos.map((vid, idx) => (
                                                                 <button
                                                                     key={vid.id || idx}
                                                                     type="button"
                                                                     onClick={(e) => { e.stopPropagation(); setActiveVideoIndex(idx); }}
                                                                     className={`flex items-center gap-[10px] px-4 py-3 rounded-[10px] text-left transition-colors ${
                                                                         activeVideoIndex === idx
                                                                             ? 'bg-purple-600 text-white'
                                                                             : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                                                                     }`}
                                                                 >
                                                                     <i className="fa-regular fa-circle-play text-[18px] flex-shrink-0"></i>
                                                                     <span className="text-[14px] font-[500] truncate">
                                                                         {idx + 1}-video: {vid.originalname || vid.video_url || `Qism ${idx + 1}`}
                                                                     </span>
                                                                 </button>
                                                             ))}
                                                         </div>
                                                     )}
                                                 </div>
                                             );
                                         })}
                                     </div>
                                 </div>
                             </aside>
                        </div>
                    </main>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px !important; display: block !important; }
                .custom-scrollbar::-webkit-scrollbar-track { background-color: transparent !important; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #9333ea !important; border-radius: 6px !important; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #7e22ce !important; }
                .custom-scrollbar { scrollbar-width: thin !important; scrollbar-color: #9333ea transparent !important; }
            `}} />
        </div>
    );
}
