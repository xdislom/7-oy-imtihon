import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';

export default function StudentDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('faol');
    const [selectedGroupForModal, setSelectedGroupForModal] = useState(null);
    const navigate = useNavigate();

    const groups = [
        { id: 1, name: 'n105', direction: 'Backend', teacher: '4', startDate: '2026 M05 1' }
    ];

    return (
        <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
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
                                            {groups.map((group, index) => (
                                                <tr 
                                                    key={group.id} 
                                                    className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/dashboard/my-groups/${group.id}`)}
                                                >
                                                    <td className="py-4 px-6 text-gray-700 text-[14px] font-medium">{index + 1}</td>
                                                    <td className="py-4 px-6 text-gray-600 text-[14px]">{group.name}</td>
                                                    <td className="py-4 px-6 text-gray-600 text-[14px]">{group.direction}</td>
                                                    <td className="py-4 px-6">
                                                        <span 
                                                            className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#c6a27a] text-white text-[13px] font-bold hover:bg-[#b08d66] transition-colors cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedGroupForModal(group);
                                                            }}
                                                        >
                                                            {group.teacher}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600 text-[14px]">{group.startDate}</td>
                                                </tr>
                                            ))}
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
                            {selectedGroupForModal.name.split(' ').pop().toLowerCase()}
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
                                    {[
                                        { id: 1, name: 'Mohirbek', role: 'TEACHER', days: 'Se, Pa, Sha', time: '16:00 - 18:00' },
                                        { id: 2, name: 'Azizbek', role: 'TEACHER', days: 'Se, Pa, Sha', time: '16:00 - 18:00' },
                                        { id: 3, name: 'Nosirxon', role: 'TEACHER', days: 'Se, Pa, Sha', time: '16:00 - 18:00' },
                                        { id: 4, name: 'Raxmonbergan', role: 'TEACHER', days: 'Se, Pa, Sha', time: '16:00 - 18:00' },
                                    ].map((teacher, idx, arr) => (
                                        <tr key={teacher.id} className={`${idx !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                            <td className="py-4 px-5 text-[14px] text-gray-800 font-medium">{teacher.name}</td>
                                            <td className="py-4 px-5 text-[14px] text-gray-800">{teacher.role}</td>
                                            <td className="py-4 px-5 text-[14px] text-gray-800">{teacher.days}</td>
                                            <td className="py-4 px-5 text-[14px] text-gray-800">{teacher.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
