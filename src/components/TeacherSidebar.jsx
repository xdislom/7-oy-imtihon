import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import najotLogo from "../assets/logo (16).png";

export default function TeacherSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const [isGroupsOpen, setIsGroupsOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem("teacher-sidebar-collapsed") === "true");

    const toggleCollapse = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem("teacher-sidebar-collapsed", String(newValue));
    };

    const isGroupsActive = location.pathname.startsWith('/dashboard/groups') || location.pathname.startsWith('/classes/groups') || location.pathname.startsWith('/dashboard/groups') || location.pathname.includes('/homework/');

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[100] md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}
            <div className={`
                fixed md:sticky top-0 left-0 z-[101] h-screen bg-white transition-all duration-300 flex flex-col shrink-0 border-r border-gray-100
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}
            `}>
                <button 
                    onClick={toggleCollapse}
                    className="hidden md:flex absolute -right-[12px] top-[25px] w-[24px] h-[24px] bg-purple-600 rounded-full items-center justify-center text-white shadow-md z-[105]"
                >
                    <i className={`fa-solid fa-chevron-${isCollapsed ? 'right' : 'left'} text-[10px]`}></i>
                </button>
                {/* Logo */}
                <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-100`}>
                    <div className="flex items-center gap-[6px] relative">
                        {!isCollapsed && <span className="font-bold text-[20px] text-[#2c323f] tracking-wider">NAJOT</span>}
                        <img src={najotLogo} alt="logo" className={`${isCollapsed ? 'w-[40px]' : 'w-[45px]'} transition-all duration-300 object-contain`} />
                        {!isCollapsed && <span className="font-bold text-[20px] text-[#2c323f] tracking-wider">TA'LIM</span>}
                    </div>
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
                        <i className="fa-solid fa-xmark text-[18px]"></i>
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                    {/* Guruhlar dropdown */}
                    <div>
                        <button
                            onClick={() => {
                                if (isCollapsed) toggleCollapse();
                                else setIsGroupsOpen(!isGroupsOpen);
                            }}
                            className={`w-full flex items-center gap-3 py-3 transition-colors duration-200 font-medium ${
                                isCollapsed ? 'justify-center px-0 rounded-[10px]' : 'justify-between px-4 rounded-[10px]'
                            } ${
                                isGroupsActive ? 'bg-purple-600 text-white' : 'text-gray-800 hover:bg-purple-600 hover:text-white'
                            }`}
                        >
                            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                                <i className="fa-solid fa-users text-[16px] shrink-0"></i>
                                {!isCollapsed && <span className="text-[15px]">Guruhlar</span>}
                            </div>
                            {!isCollapsed && <i className={`fa-solid fa-chevron-${isGroupsOpen ? 'up' : 'down'} text-[11px] ${isGroupsActive ? 'text-white' : 'text-gray-400'}`}></i>}
                        </button>

                        {isGroupsOpen && !isCollapsed && (
                            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-100 pl-3">
                                <NavLink
                                    to="/dashboard/groups"
                                    onClick={() => onClose && onClose()}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all no-underline text-[14px] font-medium ${
                                            isActive
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-800 hover:bg-purple-600 hover:text-white'
                                        }`
                                    }
                                    end
                                >
                                    <i className="fa-solid fa-layer-group text-[13px]"></i>
                                    Guruhlar
                                </NavLink>
                                <NavLink
                                    to="/dashboard/planned-groups"
                                    onClick={() => onClose && onClose()}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all no-underline text-[14px] font-medium ${
                                            isActive
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-800 hover:bg-purple-600 hover:text-white'
                                        }`
                                    }
                                >
                                    <i className="fa-solid fa-hourglass-half text-[13px]"></i>
                                    Yig'ilayotgan guruhlar
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Profil */}
                    <NavLink
                        to="/dashboard/profile"
                        onClick={() => onClose && onClose()}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3 transition-colors duration-200 no-underline font-medium ${
                                isCollapsed ? 'justify-center px-0 rounded-[10px]' : 'px-4 rounded-[10px]'
                            } ${
                                isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-800 hover:bg-purple-600 hover:text-white'
                            }`
                        }
                    >
                        <i className="fa-solid fa-user text-[16px] shrink-0"></i>
                        {!isCollapsed && <span className="text-[15px]">Profil</span>}
                    </NavLink>
                </div>
            </div>
        </>
    );
}
