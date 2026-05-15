import React from 'react';
import { IconButton, Tooltip, Avatar, Accordion, AccordionSummary, AccordionDetails, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import najot from "../assets/logo.jpg";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent('#fff')}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent('#fff')}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        borderRadius: 20 / 2,
    },
}));

export default function Header({ onMenuClick }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] gap-4">
            {/* Left Side: Menu Toggle (Mobile), Search, Calendar, Plus */}
            <div className="flex items-center gap-[10px] w-full md:w-auto">
                <IconButton 
                    onClick={onMenuClick}
                    className="md:!hidden"
                    sx={{ color: '#7c3aed' }}
                >
                    <i className="fa-solid fa-bars"></i>
                </IconButton>
                
                <div className="hidden md:flex items-center gap-[15px]">
                    <button className="flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fa-regular fa-calendar text-[22px]"></i>
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-[10px] bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-[12px] shadow-md hover:shadow-lg transition-all active:scale-95">
                        <i className="fa-solid fa-plus text-[16px]"></i>
                        <span className="font-[600] text-[15px]">Qo'shish</span>
                        <i className="fa-solid fa-chevron-down text-[12px] ml-1 opacity-80"></i>
                    </button>

                    <div className="relative w-[280px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-[15px] top-[13px] text-gray-300 text-[14px]"></i>
                        <input 
                            type="text" 
                            placeholder="Qidirish..."
                            className="w-full pl-[45px] pr-[15px] py-[10px] bg-white border border-gray-100 rounded-[12px] outline-none shadow-sm focus:border-purple-300 transition-all text-[14px] text-gray-600"
                        />
                    </div>
                </div>

                {/* Mobile visible elements */}
                <div className="md:hidden flex items-center gap-2">
                    <img src={najot} alt="najot" className="w-[35px]" />
                    <span className="text-[18px] text-purple-500 font-[600]">NajotEdu</span>
                </div>
            </div>

            {/* Right Side: Language, Notification, Theme, Avatar */}
            <div className="flex items-center gap-[15px] ml-auto">
                <div className="flex items-center gap-[10px] px-[16px] py-[8px] bg-white border border-gray-100 rounded-[12px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-[14px] font-[500] text-gray-700">O'zbekcha</span>
                    <i className="fa-solid fa-chevron-down text-[12px] text-gray-400"></i>
                </div>
                
                <div className="flex items-center gap-4">
                    <Tooltip title="Notification">
                        <IconButton sx={{ color: '#4b5563', p: 0.5 }}>
                            <i className="fa-regular fa-bell text-[20px]"></i>
                        </IconButton>
                    </Tooltip>
                    <IconButton sx={{ color: '#4b5563', p: 0.5 }}>
                        <i className="fa-regular fa-moon text-[20px]"></i>
                    </IconButton>
                    <div className="w-[42px] h-[42px] bg-[#7c3aed] rounded-full flex items-center justify-center text-white font-[600] text-[18px] shadow-sm cursor-pointer hover:bg-purple-700 transition-colors">
                        A
                    </div>
                </div>
            </div>
        </div>
    );
}
