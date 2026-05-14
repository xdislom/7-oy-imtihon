import * as React from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="max-w-[1600px] m-auto bg-gray-50 min-h-screen">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen px-[20px] md:px-[40px] pb-[40px] flex flex-col">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <div className="mt-[40px] mb-[40px]">
                        <h2 className="text-[36px] font-[700] text-gray-900 leading-tight">Salom, creater!</h2>
                        <p className="text-gray-500 text-[18px] mt-1">EduCoin platformasiga xush kelibsiz!</p>
                    </div>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[20px]">
                        <div className="bg-white p-[30px] rounded-[24px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-[50px] h-[50px] bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-users text-purple-500 text-[22px]"></i>
                            </div>
                            <h5 className="font-[600] text-gray-400 text-[15px] mb-1">Sinflar</h5>
                            <h6 className="font-[800] text-[28px] text-gray-900">0</h6>
                        </div>
                        <div className="bg-white p-[30px] rounded-[24px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-[50px] h-[50px] bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-book-open text-purple-500 text-[22px]"></i>
                            </div>
                            <h5 className="font-[600] text-gray-400 text-[15px] mb-1">Fanlar</h5>
                            <h6 className="font-[800] text-[28px] text-gray-900">0</h6>
                        </div>
                        <div className="bg-white p-[30px] rounded-[24px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-[50px] h-[50px] bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-graduation-cap text-purple-500 text-[22px]"></i>
                            </div>
                            <h5 className="font-[600] text-gray-400 text-[15px] mb-1">Talabalar</h5>
                            <h6 className="font-[800] text-[28px] text-gray-900">1</h6>
                        </div>
                        <div className="bg-white p-[30px] rounded-[24px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-[50px] h-[50px] bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-gift text-purple-500 text-[22px]"></i>
                            </div>
                            <h5 className="font-[600] text-gray-400 text-[15px] mb-1">Sovg'alar</h5>
                            <h6 className="font-[800] text-[28px] text-gray-900">3</h6>
                        </div>
                        <div className="bg-white p-[30px] rounded-[24px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                            <div className="w-[50px] h-[50px] bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-user-check text-purple-500 text-[22px]"></i>
                            </div>
                            <h5 className="font-[600] text-gray-400 text-[15px] mb-1">O'qituvchilar</h5>
                            <h6 className="font-[800] text-[28px] text-gray-900">0</h6>
                        </div>
                    </div>

                    {/* Dars Jadvali */}
                    <div className="mt-[40px]">
                        <Accordion
                            disableGutters
                            elevation={0}
                            sx={{ border: '1px solid #e5e7eb', borderRadius: '16px', bgcolor: 'white', overflow: 'hidden' }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMoreIcon sx={{ color: '#9ca3af' }} />}
                                sx={{ px: 3, py: 1 }}
                            >
                                <p className="text-[16px] font-[600] text-gray-700">Dars Jadvali</p>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
                                <div className="space-y-3">
                                    <p className="flex justify-between items-center text-[15px] font-[500] bg-gray-50 px-[20px] py-[16px] rounded-[15px] border border-gray-100 group hover:border-purple-200 transition-colors">
                                        <span className="text-gray-600">N105 ga bugun dars</span>
                                        <span className="text-purple-600 font-[800] text-[16px]">16:00</span>
                                    </p>
                                    <p className="flex justify-between items-center text-[15px] font-[500] bg-gray-50 px-[20px] py-[16px] rounded-[15px] border border-gray-100 group hover:border-purple-200 transition-colors">
                                        <span className="text-gray-600">N26 ga ertaga dars</span>
                                        <span className="text-purple-600 font-[800] text-[16px]">19:00</span>
                                    </p>
                                    <p className="flex justify-between items-center text-[15px] font-[500] bg-gray-50 px-[20px] py-[16px] rounded-[15px] border border-gray-100 group hover:border-purple-200 transition-colors">
                                        <span className="text-gray-600">N106 Dushanba kuni</span>
                                        <span className="text-purple-600 font-[800] text-[16px]">16:00</span>
                                    </p>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}