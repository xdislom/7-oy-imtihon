import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import najotLogo from "../assets/logo.jpg";

export default function StudentSidebar({ isOpen, onClose }) {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem("student-sidebar-collapsed") === "true");

    const toggleCollapse = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem("student-sidebar-collapsed", String(newValue));
    };
    
    const navItems = [
        { to: "/student/home", icon: "fa-solid fa-house", label: "Bosh sahifa" },
        { to: "/student/payments", icon: "fa-regular fa-credit-card", label: "To'lovlarim" },
        { to: "/dashboard/my-groups", icon: "fa-solid fa-users", label: "Guruhlarim" },
        { to: "/student/stats", icon: "fa-solid fa-chart-simple", label: "Ko'rsatgichlarim" },
        { to: "/student/rating", icon: "fa-solid fa-chart-column", label: "Reyting" },
        { to: "/student/shop", icon: "fa-solid fa-cart-shopping", label: "Do'kon" },
        { to: "/student/extra", icon: "fa-solid fa-podcast", label: "Qo'shimcha darslar" },
        { to: "/student/settings", icon: "fa-solid fa-gear", label: "Sozlamalar" },
    ];

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[100] md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}
            <div className={`
                fixed md:sticky top-0 left-0 z-[101] h-screen bg-white transition-all duration-300 flex flex-col shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}
            `}>
                <button 
                    onClick={toggleCollapse}
                    className="hidden md:flex absolute -right-[12px] top-[25px] w-[24px] h-[24px] bg-purple-600 rounded-full items-center justify-center text-white shadow-md z-[105]"
                >
                    <i className={`fa-solid fa-chevron-${isCollapsed ? 'right' : 'left'} text-[10px]`}></i>
                </button>
                <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-center md:justify-start'}`}>
                    <div className="flex items-center gap-2 relative">
                        <span className="font-bold text-[18px] text-gray-800 tracking-wider">XD</span>
                        <img src={najotLogo} alt="logo" className="w-[30px]" />
                        {!isCollapsed && <span className="font-bold text-[18px] text-gray-800 tracking-wider">EDU</span>}
                        {!isCollapsed && <span className="absolute -top-2 -right-8 bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[6px]">Beta</span>}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-4 py-3.5 transition-colors duration-200 no-underline ${
                                    isCollapsed ? 'justify-center px-0 rounded-[10px]' : 'px-4 rounded-[10px]'
                                } ${
                                    isActive 
                                        ? "bg-purple-600 text-white font-medium" 
                                        : "text-gray-800 hover:bg-purple-600 hover:text-white font-medium"
                                }`}
                                style={{}}
                            >
                                <div className="w-[24px] flex justify-center shrink-0">
                                    <i className={`${item.icon} text-[18px]`}></i>
                                </div>
                                {!isCollapsed && <span className="text-[15px]">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
