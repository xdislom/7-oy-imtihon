import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import najotLogo from "../assets/logo.jpg";

export default function TeacherSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const [isGroupsOpen, setIsGroupsOpen] = useState(true);

    const isGroupsActive = location.pathname.startsWith('/dashboard/groups') || location.pathname.startsWith('/classes/groups');

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[100] md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}
            <div className={`
                fixed md:sticky top-0 left-0 z-[101] h-screen bg-white transition-all duration-300 flex flex-col shrink-0 w-[260px] border-r border-gray-100
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-5 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <img src={najotLogo} alt="logo" className="w-[36px] rounded-[8px]" />
                        <span className="font-bold text-[20px] text-purple-600 tracking-wide">XD_EDU</span>
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
                            onClick={() => setIsGroupsOpen(!isGroupsOpen)}
                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] transition-all font-medium ${
                                isGroupsActive ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-users text-[16px]"></i>
                                <span className="text-[15px]">Guruhlar</span>
                            </div>
                            <i className={`fa-solid fa-chevron-${isGroupsOpen ? 'up' : 'down'} text-[11px] text-gray-400`}></i>
                        </button>

                        {isGroupsOpen && (
                            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-100 pl-3">
                                <NavLink
                                    to="/dashboard/groups"
                                    onClick={() => onClose && onClose()}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all no-underline text-[14px] font-medium ${
                                            isActive
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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
                            `flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all no-underline font-medium ${
                                isActive
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <i className="fa-solid fa-user text-[16px]"></i>
                        <span className="text-[15px]">Profil</span>
                    </NavLink>
                </div>
            </div>
        </>
    );
}
