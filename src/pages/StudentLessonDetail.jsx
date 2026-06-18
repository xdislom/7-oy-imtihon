import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';

export default function StudentLessonDetail() {
    const { groupId, lessonId } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [lessonData, setLessonData] = useState(null);
    const [homework, setHomework] = useState(null);
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
                if (hwData?.data?.homework) hwObj = hwData.data.homework;
                else if (hwData?.homework) hwObj = hwData.homework;
                else if (Array.isArray(hwData)) hwObj = hwData[0];
                else if (hwData?.data && Array.isArray(hwData.data)) hwObj = hwData.data[0];
                else hwObj = hwData;
                
                setHomework(hwObj);

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

    return (
        <div className="w-full min-h-screen bg-[#f5f5f2] font-sans">
            <div className="flex min-h-screen">
                <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
                    <StudentHeader
                        onMenuClick={() => setIsSidebarOpen(true)}
                        isSidebarOpen={isSidebarOpen}
                        onSidebarClose={() => setIsSidebarOpen(false)}
                    />

                    <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
                        <div className="max-w-[1300px] mx-auto flex flex-col xl:flex-row gap-6">
                            {/* LEFT COLUMN */}
                            <section className="flex-1 flex flex-col gap-4">
                                <div className="bg-white rounded-[14px] border border-[#ece9e2] shadow-sm overflow-hidden">
                                    <div className="h-[500px] sm:h-[430px] md:h-[500px] w-full bg-[#111111] relative">
                                        {loading ? (
                                            <div className="flex items-center justify-center w-full h-full">
                                                <i className="fa-solid fa-spinner animate-spin text-gray-300 text-3xl"></i>
                                            </div>
                                        ) : videos && videos.length > 0 ? (
                                            <video
                                                key={activeVideoIndex}
                                                className="w-full h-full object-contain bg-black"
                                                controls
                                                controlsList="nodownload"
                                                src={`https://najot-edu.softwareengineer.uz/files/files/${videos[activeVideoIndex]?.video_url || videos[activeVideoIndex]?.file || videos[activeVideoIndex]?.video || videos[activeVideoIndex]?.url || videos[activeVideoIndex]?.name}`}
                                            >
                                                Brauzeringiz video formatini qo'llab-quvvatlamaydi.
                                            </video>
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
                                            {loading ? 'Yuklanmoqda...' : (lessonData?.title || lessonData?.name || "Noma'lum mavzu")}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[14px] border border-[#ece9e2] shadow-sm overflow-hidden">
                                    <div className="flex items-center border-b border-[#ece9e2] px-5">
                                        <button className="py-4 text-[#c59c73] font-semibold text-[15px] border-b-2 border-[#c59c73]">
                                            Vazifalar
                                        </button>
                                    </div>

                                    <div className="p-5 md:p-6">
                                        {loading ? (
                                            <div className="text-gray-400 py-10 text-center">Yuklanmoqda...</div>
                                        ) : homework ? (
                                            <div>
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                                    <div>
                                                        <h4 className="text-[18px] font-semibold text-[#111827]">Uyga vazifa</h4>
                                                        <p className="text-[13px] text-gray-500 mt-1">
                                                            {lessonData?.title || lessonData?.name || 'Dars'} uchun topshiriq
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                                        <div className="bg-[#ff3b30] text-white px-4 py-2 rounded-[8px] flex items-center gap-2 text-[13px] font-medium shadow-sm">
                                                            <i className="fa-regular fa-circle-exclamation"></i>
                                                            <span>Uyga vazifa muddati: {getHwDeadline(homework, lessonData)}</span>
                                                        </div>
                                                        <div className="text-gray-500 text-[13px] font-medium">
                                                            Fayllar: {Array.isArray(homework.files) ? homework.files.length : (homework.file || homework.files ? 1 : 0)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="prose max-w-none text-[15px] leading-7 text-gray-700">
                                                    {homework.description || homework.content || homework.title || 'Vazifa matni kiritilmagan.'}
                                                </div>

                                                {(homework.file || (Array.isArray(homework.files) && homework.files.length > 0)) && (
                                                    <div className="mt-8 border-t border-[#ece9e2] pt-6">
                                                        <h5 className="text-[14px] font-semibold text-gray-700 mb-3">Biriktirilgan fayl</h5>
                                                        <div className="flex flex-wrap gap-3">
                                                            {(Array.isArray(homework.files) ? homework.files : [homework.file]).filter(Boolean).map((file, idx) => (
                                                                <a
                                                                    key={`${file}-${idx}`}
                                                                    href={`https://najot-edu.softwareengineer.uz/files/files/${file}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-3 px-4 py-3 bg-[#f9f8f4] border border-[#ece9e2] rounded-[10px] hover:border-[#c59c73] hover:bg-[#fffaf1] transition-all max-w-sm"
                                                                >
                                                                    <div className="w-10 h-10 rounded-[8px] bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center shrink-0">
                                                                        <i className="fa-solid fa-file-lines text-[16px]"></i>
                                                                    </div>
                                                                    <span className="text-[14px] font-medium text-gray-700 truncate">{file}</span>
                                                                    <i className="fa-solid fa-download text-[14px] text-gray-400 ml-auto pl-2"></i>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 text-center py-10">Bu dars uchun uyga vazifa topilmadi.</div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* RIGHT COLUMN */}
                            <aside className="w-full xl:w-[360px] xl:flex-shrink-0">
                                <div className="bg-white rounded-[14px] border border-[#ece9e2] shadow-sm p-3 h-full">
                                    <div className="flex items-center justify-between px-3 py-2 mb-2">
                                        <h3 className="text-[15px] font-semibold text-[#1f2937]">Darslar ro'yxati</h3>
                                        <span className="text-[12px] text-gray-500">{allLessons.length}</span>
                                    </div>

                                    <div className="flex flex-col gap-2 max-h-[760px] overflow-y-auto pr-1 custom-scrollbar">
                                        {allLessons.map((l, i) => {
                                            const isActive = String(l.id) === String(lessonId);
                                            const vCount = l.videoCount !== undefined ? l.videoCount : (l.videos?.length || l.video_count || 0);
                                            const hasVideos = vCount > 0 || isActive;

                                            return (
                                                <div key={l.id || i} className="rounded-[12px] border border-[#eee7d8] overflow-hidden">
                                                    <div
                                                        className={`px-4 h-[100px] cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                                                            isActive ? 'bg-[#f7e6c6]' : 'bg-[#faf8f3] hover:bg-[#f5efe1]'
                                                        }`}
                                                        onClick={() => !isActive && navigate(`/dashboard/my-groups/${groupId}/lessons/${l.id}`)}
                                                    >
                                                        <div>
                                                            <h4 className="text-[14px] font-semibold text-[#1f2937] leading-snug">
                                                                {l.title || l.name || `Dars ${i + 1}`}
                                                            </h4>
                                                            <p className="text-[12px] text-gray-500 mt-1">
                                                                {formatDate(l.date || l.created_at)}
                                                            </p>
                                                        </div>
                                                        {hasVideos && (
                                                            <i className={`fa-solid fa-chevron-down text-[12px] text-gray-500 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}></i>
                                                        )}
                                                    </div>

                                                    {isActive && videos && videos.length > 0 && (
                                                        <div className="px-3 pb-3 pt-1 flex flex-col gap-2 bg-[#fdf9f1]">
                                                            {videos.map((vid, idx) => (
                                                                <button
                                                                    key={vid.id || idx}
                                                                    type="button"
                                                                    onClick={() => setActiveVideoIndex(idx)}
                                                                    className={`flex items-center gap-3 px-3 py-3 rounded-[10px] text-left transition-colors ${
                                                                        activeVideoIndex === idx
                                                                            ? 'bg-[#f1c98c] text-[#3b2510]'
                                                                            : 'bg-[#f7edd3] text-[#5a3e28] hover:bg-[#f1ddad]'
                                                                    }`}
                                                                >
                                                                    <i className="fa-regular fa-circle-play text-[16px] flex-shrink-0"></i>
                                                                    <span className="text-[13px] font-medium truncate">
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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 999px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
            `}} />
        </div>
    );
}
