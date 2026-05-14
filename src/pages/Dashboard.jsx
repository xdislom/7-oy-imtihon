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
                <div className="w-full min-h-screen px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <div className="mt-[20px]">
                        <h2 className="text-[28px] font-[600]">Salom, creater!</h2>
                        <p className="text-gray-600 font-[500]">EduCoin platformasiga xush kelibsiz!</p>
                    </div>

                    {/* Dashboard Cards in one row */}
                    <div className="flex flex-wrap gap-[20px] mt-[40px] items-stretch">
                        <div className="flex-1 min-w-[200px] h-[180px] rounded-[20px] bg-white border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <i className="fa-solid fa-user-group text-purple-500 text-[24px]"></i>
                            <h5 className="pt-[15px] font-[600] text-gray-700">Sinflar</h5>
                            <h6 className="pt-[10px] font-bold text-[20px]">0</h6>
                        </div>
                        <div className="flex-1 min-w-[200px] h-[180px] rounded-[20px] bg-white border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <i className="fa-solid fa-book-open text-purple-500 text-[24px]"></i>
                            <h5 className="pt-[15px] font-[600] text-gray-700">Fanlar</h5>
                            <h6 className="pt-[10px] font-[600] text-[20px]">0</h6>
                        </div>
                        <div className="flex-1 min-w-[200px] h-[180px] rounded-[20px] bg-white border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <i className="fa-solid fa-user-graduate text-purple-500 text-[24px]"></i>
                            <h5 className="pt-[15px] font-[600] text-gray-700">Talabalar</h5>
                            <h6 className="pt-[10px] font-[600] text-[20px]">1</h6>
                        </div>
                        <div className="flex-1 min-w-[200px] h-[180px] rounded-[20px] bg-white border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <i className="fa-solid fa-gift text-purple-500 text-[24px]"></i>
                            <h5 className="pt-[15px] font-[600] text-gray-700">Sovg'alar</h5>
                            <h6 className="pt-[10px] font-[600] text-[20px]">3</h6>
                        </div>
                        <div className="flex-1 min-w-[200px] h-[180px] rounded-[20px] bg-white border border-gray-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <i className="fa-solid fa-user-check text-purple-500 text-[24px]"></i>
                            <h5 className="pt-[15px] font-[600] text-gray-700">O'qituvchilar</h5>
                            <h6 className="pt-[10px] font-[600] text-[20px]">0</h6>
                        </div>
                    </div>

                    <div className="mt-[40px]">
                        <Accordion
                            disableGutters
                            elevation={0}
                            sx={{ border: '1px solid #e5e7eb', borderRadius: '20px', bgcolor: 'white' }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <p className="text-[16px] font-[600]">Dars Jadvali</p>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
                                <div className="space-y-3">
                                    <p className="flex justify-between items-center text-[15px] font-[500] bg-gray-50 px-[20px] py-[12px] rounded-[15px] border border-gray-100">
                                        <span>N105 ga bugun dars</span>
                                        <span className="text-purple-600 font-[700]">16:00</span>
                                    </p>
                                    <p className="flex justify-between items-center text-[15px] font-[500] bg-gray-50 px-[20px] py-[12px] rounded-[15px] border border-gray-100">
                                        <span>N26 ga ertaga dars</span>
                                        <span className="text-purple-600 font-[700]">19:00</span>
                                    </p>
                                    <p className="flex justify-between items-center text-[15px] font-[500] bg-gray-50 px-[20px] py-[12px] rounded-[15px] border border-gray-100">
                                        <span>N106 Dushanba kuni</span>
                                        <span className="text-purple-600 font-[700]">16:00</span>
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