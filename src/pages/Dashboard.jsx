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

                    <div className="mt-[30px] mb-[40px] flex justify-between items-center relative">
                        <div className="z-10">
                            <h2 className="text-[32px] font-[700] text-gray-900 leading-tight">Salom, Iskandarov Islom!</h2>
                            <p className="text-gray-500 text-[16px] mt-1 font-[500]">NajotEdu platformasiga xush kelibsiz!</p>
                        </div>
                    </div>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-[20px]">
                        <div className="bg-white p-[25px] rounded-[18px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group h-[160px]">
                            <div className="mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-graduation-cap text-purple-600 text-[24px]"></i>
                            </div>
                            <h5 className="font-[500] text-gray-500 text-[14px] mb-2">Faol talabalar</h5>
                            <h6 className="font-[700] text-[26px] text-gray-900">52</h6>
                        </div>
                        <div className="bg-white p-[25px] rounded-[18px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group h-[160px]">
                            <div className="mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-users text-purple-600 text-[24px]"></i>
                            </div>
                            <h5 className="font-[500] text-gray-500 text-[14px] mb-2">Guruhlar</h5>
                            <h6 className="font-[700] text-[26px] text-gray-900">23</h6>
                        </div>
                        <div className="bg-white p-[25px] rounded-[18px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group h-[160px]">
                            <div className="mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-credit-card text-purple-600 text-[24px]"></i>
                            </div>
                            <h5 className="font-[500] text-gray-500 text-[14px] mb-2 text-center leading-tight">Joriy oy to'lovlar</h5>
                            <h6 className="font-[700] text-[26px] text-gray-900">0</h6>
                        </div>
                        <div className="bg-white p-[25px] rounded-[18px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group h-[160px]">
                            <div className="mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-triangle-exclamation text-purple-600 text-[24px]"></i>
                            </div>
                            <h5 className="font-[500] text-gray-500 text-[14px] mb-2">Qarzdorlar</h5>
                            <h6 className="font-[700] text-[26px] text-gray-900">104</h6>
                        </div>
                        <div className="bg-white p-[25px] rounded-[18px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group h-[160px]">
                            <div className="mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-snowflake text-purple-600 text-[24px]"></i>
                            </div>
                            <h5 className="font-[500] text-gray-500 text-[14px] mb-2">Muzatilganlar</h5>
                            <h6 className="font-[700] text-[26px] text-gray-900">0</h6>
                        </div>
                        <div className="bg-white p-[25px] rounded-[18px] border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group h-[160px]">
                            <div className="mb-3 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-box-archive text-purple-600 text-[24px]"></i>
                            </div>
                            <h5 className="font-[500] text-gray-500 text-[14px] mb-2">Arxivdagilar</h5>
                            <h6 className="font-[700] text-[26px] text-gray-900">23</h6>
                        </div>
                    </div>

                    {/* Accordions */}
                    <div className="mt-[40px] space-y-4">
                        <Accordion
                            disableGutters
                            elevation={0}
                            sx={{ border: '1px solid #f3f4f6', borderRadius: '12px !important', bgcolor: 'white', mb: 2 }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMoreIcon sx={{ color: '#9ca3af' }} />}
                                sx={{ px: 3, py: 1 }}
                            >
                                <p className="text-[16px] font-[600] text-gray-800">Joriy oy uchun to'lovlar</p>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: '1px solid #f9fafb', p: 3 }}>
                                <p className="text-gray-500 text-[14px]">Hozircha ma'lumot yo'q.</p>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            disableGutters
                            elevation={0}
                            sx={{ border: '1px solid #f3f4f6', borderRadius: '12px !important', bgcolor: 'white', mb: 2 }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMoreIcon sx={{ color: '#9ca3af' }} />}
                                sx={{ px: 3, py: 1 }}
                            >
                                <p className="text-[16px] font-[600] text-gray-800">Yillik Foyda</p>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: '1px solid #f9fafb', p: 3 }}>
                                <p className="text-gray-500 text-[14px]">Hozircha ma'lumot yo'q.</p>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            disableGutters
                            elevation={0}
                            sx={{ border: '1px solid #f3f4f6', borderRadius: '12px !important', bgcolor: 'white' }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMoreIcon sx={{ color: '#9ca3af' }} />}
                                sx={{ px: 3, py: 1 }}
                            >
                                <p className="text-[16px] font-[600] text-gray-800">Dars jadvali</p>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: '1px solid #f9fafb', p: 3 }}>
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