import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import najotLogo from "../assets/logo.jpg";

export default function StudentSidebar({ isOpen, onClose }) {
    const location = useLocation();
    
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
                fixed md:sticky top-0 left-0 z-[101] h-screen bg-white transition-all duration-300 flex flex-col shrink-0 w-[260px]
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-5 flex items-center justify-center md:justify-start">
                    <div className="flex items-center gap-2 relative">
                        <span className="font-bold text-[18px] text-gray-800 tracking-wider">XD</span>
                        <img src={najotLogo} alt="logo" className="w-[30px]" />
                        <span className="font-bold text-[18px] text-gray-800 tracking-wider">EDU</span>
                        <span className="absolute -top-2 -right-8 bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[6px]">Beta</span>
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
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-[12px] transition-all no-underline ${
                                    isActive 
                                        ? "bg-[#fff7ed] text-[#ea580c] font-medium" 
                                        : "text-gray-600 hover:bg-gray-50 font-medium"
                                }`}
                                style={isActive ? { color: '#ea580c', backgroundColor: '#fff7ed' } : { color: '#4b5563' }}
                            >
                                <div className="w-[24px] flex justify-center">
                                    <i className={`${item.icon} text-[18px]`}></i>
                                </div>
                                <span className="text-[15px]">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
