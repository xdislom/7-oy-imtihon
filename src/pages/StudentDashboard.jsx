import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';

export default function StudentDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('faol');
    const [selectedGroupForModal, setSelectedGroupForModal] = useState(null);
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://najot-edu.softwareengineer.uz/api/v1/students/my/groups', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resData = await response.json();
                console.log('📦 Groups RAW API:', JSON.stringify(resData, null, 2));
                if (response.ok) {
                    const list = resData.data || resData || [];
                    const arr = Array.isArray(list) ? list : [];
                    console.log('✅ Groups list:', arr);
                    setGroups(arr);
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoadingGroups(false);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div className="w-full bg-gray-100 min-h-screen font-sans">
            <div className="flex">
                <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 w-full overflow-hidden">
                    <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} onSidebarClose={() => setIsSidebarOpen(false)} />
                    
                    <div className="p-[20px] md:p-[30px] flex-1">
                        <div className="flex gap-6 border-b border-gray-200 mb-6 px-1">
                            <button 
                                className={`pb-3 px-2 font-bold text-[15px] transition-colors relative ${activeTab === 'faol' ? 'text-[#c6a27a]' : 'text-[#8c94a3] hover:text-gray-600'}`}
                                onClick={() => setActiveTab('faol')}
                            >
                                Faol
                                {activeTab === 'faol' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c6a27a]"></div>}
                            </button>
                            <button 
                                className={`pb-3 px-2 font-bold text-[15px] transition-colors relative ${activeTab === 'tugagan' ? 'text-[#c6a27a]' : 'text-[#8c94a3] hover:text-gray-600'}`}
                                onClick={() => setActiveTab('tugagan')}
                            >
                                Tugagan
                                {activeTab === 'tugagan' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c6a27a]"></div>}
                            </button>
                        </div>

                        {activeTab === 'faol' && (
                            <div className="bg-white rounded-[12px] shadow-sm overflow-hidden border border-gray-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-white">
                                                <th className="py-5 px-6 font-bold text-gray-900 text-[14px] w-[5%]">#</th>
                                                <th className="py-5 px-6 font-bold text-gray-900 text-[14px] w-[35%]">Guruh nomi</th>
                                                <th className="py-5 px-6 font-bold text-gray-900 text-[14px] w-[20%]">Yo'nalishi</th>
                                                <th className="py-5 px-6 font-bold text-gray-900 text-[14px] w-[15%]">O'qituvchi</th>
                                                <th className="py-5 px-6 font-bold text-gray-900 text-[14px] w-[25%]">Boshlash vaqti</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingGroups ? (
                                                <tr>
                                                    <td colSpan="5" className="py-8 text-center text-gray-500">Yuklanmoqda...</td>
                                                </tr>
                                            ) : groups.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="py-8 text-center text-gray-500">Guruhlar topilmadi</td>
                                                </tr>
                                            ) : (
                                                groups.map((item, index) => {
                                                    // API qaytargan to'g'ri field nomlar
                                                    const groupId = item.groupId || item.group_id || item.id;
                                                    const nameDisplay = item.groupName || item.group_name || item.name || "Noma'lum guruh";
                                                    const directionDisplay = item.courseName || item.course_name || "Noma'lum";
                                                    
                                                    // O'qituvchi countni ko'rsatish
                                                    let teacherDisplay = String(item.teachersCount || item.teachers?.length || '?');
                                                    
                                                    const rawDate = item.startDate || item.start_date;
                                                    const startDateDisplay = rawDate ? new Date(rawDate).toLocaleDateString() : "Noma'lum";
                                                    
                                                    return (
                                                        <tr 
                                                            key={groupId || index} 
                                                            className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer"
                                                            onClick={() => navigate(`/dashboard/my-groups/${groupId}`)}
                                                        >
                                                            <td className="py-4 px-6 text-gray-700 text-[14px] font-medium">{index + 1}</td>
                                                            <td className="py-4 px-6 text-gray-600 text-[14px] font-bold">{nameDisplay}</td>
                                                            <td className="py-4 px-6 text-gray-600 text-[14px]">{directionDisplay}</td>
                                                            <td className="py-4 px-6">
                                                                <span 
                                                                    className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#c6a27a] text-white text-[13px] font-bold hover:bg-[#b08d66] transition-colors cursor-pointer uppercase"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedGroupForModal(item);
                                                                    }}
                                                                >
                                                                    {teacherDisplay}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6 text-gray-600 text-[14px]">{startDateDisplay}</td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'tugagan' && (
                            <div className="bg-white rounded-[12px] p-8 shadow-sm text-center border border-gray-100">
                                <p className="text-gray-500 text-[14px]">Tugagan guruhlar yo'q</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedGroupForModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedGroupForModal(null)}>
                    <div 
                        className="bg-white rounded-[8px] p-8 w-[90%] max-w-[800px] shadow-xl max-h-[90vh] overflow-y-auto transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-[22px] font-bold text-gray-800 mb-1">
                            {selectedGroupForModal.groupName || selectedGroupForModal.name || "Guruh"}
                        </h2>
                        <p className="text-[15px] text-gray-500 mb-8">Faol</p>
                        
                        <div className="overflow-x-auto rounded-[8px] border border-gray-100">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100">
                                        <th className="py-4 px-5 font-bold text-gray-900 text-[14px] w-[30%]">O'qituvchi</th>
                                        <th className="py-4 px-5 font-bold text-gray-900 text-[14px] w-[20%]">Roli</th>
                                        <th className="py-4 px-5 font-bold text-gray-900 text-[14px] w-[25%]">Dars kunlari</th>
                                        <th className="py-4 px-5 font-bold text-gray-900 text-[14px] w-[25%]">Dars vaqti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedGroupForModal.teachers || []).map((teacher, idx, arr) => {
                                        const dayMap = {
                                            "MONDAY": "Du", "TUESDAY": "Se", "WEDNESDAY": "Ch",
                                            "THURSDAY": "Pa", "FRIDAY": "Ju", "SATURDAY": "Sha", "SUNDAY": "Yak"
                                        };
                                        const daysStr = Array.isArray(teacher.week_day) 
                                            ? teacher.week_day.map(d => dayMap[d] || d).join(', ')
                                            : teacher.week_day || 'Noma\'lum';
                                            
                                        const timeStr = teacher.start_time 
                                            ? `${teacher.start_time}` + (teacher.duration_hours ? ` (${teacher.duration_hours} soat)` : '')
                                            : 'Noma\'lum';

                                        return (
                                            <tr key={idx} className={`${idx !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                                <td className="py-4 px-5 text-[14px] text-gray-800 font-medium">{teacher.full_name || teacher.name || "Noma'lum"}</td>
                                                <td className="py-4 px-5 text-[14px] text-gray-800">{teacher.role || 'TEACHER'}</td>
                                                <td className="py-4 px-5 text-[14px] text-gray-800">{daysStr}</td>
                                                <td className="py-4 px-5 text-[14px] text-gray-800">{timeStr}</td>
                                            </tr>
                                        );
                                    })}
                                    {(!selectedGroupForModal.teachers || selectedGroupForModal.teachers.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="py-4 px-5 text-[14px] text-gray-500 text-center">O'qituvchilar topilmadi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
