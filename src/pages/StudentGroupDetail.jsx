import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';
import { useParams, useNavigate } from 'react-router-dom';

export default function StudentGroupDetail() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [filter, setFilter] = useState('Barchasi');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('🔑 useParams id:', id, '| type:', typeof id);
                
                // id raqam ekanligini tekshirish
                const numericId = parseInt(id);
                if (!id || isNaN(numericId)) {
                    console.error('❌ id raqam emas:', id);
                    setLoading(false);
                    return;
                }

                const url = `https://najot-edu.softwareengineer.uz/api/v1/groups/${numericId}/lessons/all`;
                console.log('🌐 Fetching:', url);
                
                const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await response.json();
                console.log('📦 RAW API response:', JSON.stringify(data, null, 2));

                if (response.ok) {
                    // Barcha mumkin bo'lgan joylarda massivni qidirish
                    let list = [];
                    if (Array.isArray(data)) {
                        list = data;
                    } else if (Array.isArray(data.data)) {
                        list = data.data;
                    } else if (Array.isArray(data.lessons)) {
                        list = data.lessons;
                    } else if (data.data && Array.isArray(data.data.lessons)) {
                        list = data.data.lessons;
                    } else if (data.data && Array.isArray(data.data.data)) {
                        list = data.data.data;
                    } else if (typeof data === 'object' && data !== null) {
                        // Barcha object kalitlarini tekshirish
                        for (const key of Object.keys(data)) {
                            if (Array.isArray(data[key]) && data[key].length > 0) {
                                list = data[key];
                                break;
                            }
                        }
                        // Nested obyekt ichida ham qidirish
                        if (list.length === 0 && data.data && typeof data.data === 'object') {
                            for (const key of Object.keys(data.data)) {
                                if (Array.isArray(data.data[key]) && data.data[key].length > 0) {
                                    list = data.data[key];
                                    break;
                                }
                            }
                        }
                    }

                    console.log('✅ Parsed lessons list:', list);
                    setLessons(list);

                    // Guruh nomini aniqlash
                    const groupInfo = data.group || data.data?.group || null;
                    if (groupInfo?.name) setGroupName(groupInfo.name);
                    else if (data.name) setGroupName(data.name);
                }
            } catch (error) {
                console.error('Error fetching lessons:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, [id]);

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
            return `${day} ${monthName}, ${year} yil ${hours}:${minutes}`;
        }
        return `${day} ${monthName}, ${year} yil`;
    };

    const getHwStatus = (lesson) => {
        const hw = lesson.homework || lesson.home_work;
        const status = lesson.status || hw?.status || hw?.homework_status || '';
        if (!status) return 'Berilmagan';
        const s = status.toLowerCase();
        if (s === 'returned' || s === 'qaytarilgan') return 'Qaytarilgan';
        if (s === 'accepted' || s === 'qabul_qilingan' || s === 'qabul qilingan') return 'Qabul qilingan';
        if (s === 'not_done' || s === 'bajarilmagan') return 'Bajarilmagan';
        if (s === 'not_given' || s === 'berilmagan') return 'Berilmagan';
        if (s === 'pending' || s === 'kutayotganlar') return 'Kutayotganlar';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    const getHwDeadline = (lesson) => {
        const rawDate = lesson.date || lesson.lesson_date || lesson.created_at || lesson.start_date;
        if (!rawDate) return '-';
        const d = new Date(rawDate);
        if (isNaN(d)) return '-';
        d.setHours(d.getHours() + 20); // 20 soat qo'shish
        return formatDate(d.toISOString(), true);
    };

    const getLessonDate = (lesson) => {
        const rawDate = lesson.date || lesson.lesson_date || lesson.created_at || lesson.start_date;
        return formatDate(rawDate, false);
    };

    const getVideoCount = (lesson) => {
        const videos = lesson.videoCount !== undefined ? lesson.videoCount : (lesson.videos || lesson.video_count);
        if (Array.isArray(videos)) return videos.length;
        if (typeof videos === 'number') return videos;
        return 0;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Qaytarilgan': return 'bg-[#fbb630]';
            case 'Qabul qilingan': return 'bg-[#50bc5f]';
            case 'Berilmagan': return 'bg-[#7b809a]';
            case 'Bajarilmagan': return 'bg-[#ef4444]';
            case 'Kutayotganlar': return 'bg-[#6366f1]';
            default: return 'bg-gray-500';
        }
    };

    const filteredLessons = filter === 'Barchasi'
        ? lessons
        : lessons.filter(l => getHwStatus(l) === filter);

    return (
        <div className="w-full bg-gray-100 min-h-screen font-sans">
            <div className="flex">
                <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 w-full overflow-hidden">
                    <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} onSidebarClose={() => setIsSidebarOpen(false)} />
                    
                    <div className="p-[20px] md:p-[30px]">
                        <div className="flex items-center gap-4 mb-4">
                            <button 
                                onClick={() => navigate('/dashboard/my-groups')}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left text-gray-600"></i>
                            </button>
                            <h2 className="text-[20px] font-bold text-gray-800">{groupName || `Guruh #${id}`}</h2>
                        </div>
                        <div className="bg-white rounded-[12px] p-[24px] shadow-sm">
                            <div className="mb-6 flex flex-col gap-2">
                                <h3 className="text-[#8c94a3] font-[500] text-[15px]">Uy vazifa statusi</h3>
                                <div className="relative inline-block w-[200px]">
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="appearance-none w-full bg-white border border-[#c6a27a] text-gray-700 py-2 px-4 pr-8 rounded-[4px] leading-tight focus:outline-none focus:border-[#c6a27a] font-medium cursor-pointer"
                                    >
                                        <option>Barchasi</option>
                                        <option>Qaytarilgan</option>
                                        <option>Qabul qilingan</option>
                                        <option>Berilmagan</option>
                                        <option>Bajarilmagan</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-800">
                                        <i className="fa-solid fa-caret-down text-[14px]"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[25%]">Mavzular</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[15%]">Video</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[20%]">Uyga vazifa Holati</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[25%]">Uyga vazifa tugash vaqti</th>
                                            <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[15%]">Dars sanasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="py-10 text-center text-gray-400">Yuklanmoqda...</td>
                                            </tr>
                                        ) : filteredLessons.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-10 text-center text-gray-400">Darslar topilmadi</td>
                                            </tr>
                                        ) : (
                                            filteredLessons.map((lesson, index) => {
                                                const hwStatus = getHwStatus(lesson);
                                                return (
                                                    <tr key={lesson.id || index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-4 px-4 text-gray-700 text-[14px] font-medium">
                                                            {lesson.title || lesson.name || lesson.topic || lesson.subject || `Dars ${index + 1}`}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full border border-[#60a5fa] text-[#60a5fa] text-[13px] font-medium">
                                                                {getVideoCount(lesson)}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`inline-flex items-center justify-center text-white text-[13px] font-medium px-4 py-1.5 rounded-[4px] min-w-[120px] ${getStatusStyle(hwStatus)}`}>
                                                                {hwStatus}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-gray-700 text-[14px]">{getHwDeadline(lesson)}</td>
                                                        <td className="py-4 px-4 text-gray-700 text-[14px]">{getLessonDate(lesson)}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
