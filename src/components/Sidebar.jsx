import { NavLink, useLocation } from 'react-router-dom'
import { Button, IconButton } from "@mui/material"
import {
    HomeOutlined,
    PersonOutlineOutlined,
    LayersOutlined,
    SchoolOutlined,
    DiamondOutlined,
    TuneOutlined
} from '@mui/icons-material'
import { useState } from "react"
import najot from "../assets/logo.jpg"

const navItems = [
    { to: "/dashboard", Icon: HomeOutlined, label: "Asosiy" },
    { to: "/teachers", Icon: PersonOutlineOutlined, label: "O'qituvchilar" },
    { to: "/classes", Icon: LayersOutlined, label: "Guruhlar" },
    { to: "/students", Icon: SchoolOutlined, label: "Talabalar" },
    { to: "/gifts", Icon: DiamondOutlined, label: "Sovg'alar" },
    { to: "/settings", Icon: TuneOutlined, label: "Boshqarish" },
]

const settingsSubmenu = [
    { icon: "fa-solid fa-graduation-cap", label: "Kurslar",      tab: "Kurslar" },
    { icon: "fa-solid fa-door-open",      label: "Xonalar",      tab: "Xonalar" },
    { icon: "fa-solid fa-user-tag",       label: "Hodimlar",     tab: "Hodimlar" },
]

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation()
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem("sidebar-collapsed") === "true")

    const toggleCollapse = () => {
        const newValue = !isCollapsed
        setIsCollapsed(newValue)
        localStorage.setItem("sidebar-collapsed", String(newValue))
    }

    const handleBoshqarishClick = (e) => {
        e.preventDefault()
        setIsSubmenuOpen(!isSubmenuOpen)
    }

    const handleSubmenuItemClick = () => {
        setIsSubmenuOpen(false)
        if (onClose) onClose()
    }

    return (
        <>
            {/* Dark Backdrop for Submenu */}
            {isSubmenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300"
                    onClick={() => setIsSubmenuOpen(false)}
                />
            )}

            {isOpen && !isSubmenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[100] md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed md:sticky top-0 left-0 z-[101] h-screen bg-white transition-all duration-300 flex shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
            `}>
                <button 
                    onClick={toggleCollapse}
                    className="hidden md:flex absolute -right-[12px] top-[25px] w-[24px] h-[24px] bg-purple-600 rounded-full items-center justify-center text-white shadow-md z-[105]"
                >
                    <i className={`fa-solid fa-chevron-${isCollapsed ? 'right' : 'left'} text-[10px]`}></i>
                </button>

                <div className={`h-full p-[20px] flex flex-col justify-between border-r border-gray-100 bg-white z-[102] w-full overflow-hidden`}>
                    <ul className="list-none p-0 m-0">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                            <div className="flex items-center">
                                <img src={najot} alt="najot" className="w-[40px]" />
                                {!isCollapsed && <li className="text-[24px] text-purple-500 font-[500] pt-[7px] ml-2">XD_EDU</li>}
                            </div>
                            {!isCollapsed && (
                                <IconButton onClick={onClose} className="md:!hidden">
                                    <i className="fa-solid fa-xmark text-gray-400"></i>
                                </IconButton>
                            )}
                        </div>
                        <hr className="w-full mt-2 mb-2" />
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={(e) => {
                                    if (item.to === "/settings") {
                                        handleBoshqarishClick(e);
                                    } else {
                                        setIsSubmenuOpen(false);
                                        if (onClose) onClose();
                                    }
                                }}
                                className={({ isActive }) =>
                                    `text-[20px] font-[500] rounded-[10px] mt-[15px] flex items-center gap-[10px] h-[50px] cursor-pointer transition-colors duration-200 no-underline ${
                                        isCollapsed ? 'justify-center px-0' : 'pl-[20px]'
                                    } ${
                                        isActive && !isSubmenuOpen
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-800 hover:bg-purple-600 hover:text-white"
                                    } ${item.to === "/settings" && isSubmenuOpen ? "bg-purple-600 text-white" : ""}`
                                }
                            >
                                <item.Icon sx={{ fontSize: 24 }} />
                                {!isCollapsed && item.label}
                            </NavLink>
                        ))}
                    </ul>
                    {!isCollapsed && (
                        <div className="w-full rounded-[16px] p-[16px] subscription-card border border-gray-200 dark:border-zinc-800 mt-4">
                            <div className="flex items-center gap-[12px] mb-[12px]">
                                <div className="text-[26px] flex items-center justify-center animate-bounce">
                                    🔔
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-[700] text-black leading-tight">Obuna</span>
                                    <span className="text-[#ef4444] text-[13px] font-[500] mt-0.5 leading-tight">Obunangiz tugagan</span>
                                </div>
                            </div>
                            <button className="w-full py-[10px] bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 text-white font-[600] text-[14px] rounded-[10px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                                <i className="fa-solid fa-arrow-rotate-right text-[13px]"></i>
                                Obunani yangilash
                            </button>
                        </div>
                    )}
                </div>

                {/* Settings Submenu Panel (Overlay) */}
                <div className={`
                    fixed md:absolute top-0 z-[101] w-[240px] h-full bg-gray-50 border-r border-gray-100 p-[20px] pt-[30px] transition-all duration-300
                    ${isCollapsed ? 'left-[80px]' : 'left-[280px]'}
                    ${isSubmenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}
                `}>
                    <p className="text-gray-400 text-[13px] font-[600] uppercase tracking-wider mb-2 px-[15px]">Menu</p>
                    <hr className="mx-[15px] mb-4 border-gray-200" />
                    <ul className="list-none p-0 m-0">
                        {settingsSubmenu.map((item) => (
                            <NavLink
                                key={item.tab}
                                to={`/settings?tab=${item.tab}`}
                                onClick={handleSubmenuItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-[12px] text-[16px] font-[500] px-[15px] py-[12px] rounded-[10px] mt-[6px] cursor-pointer transition-colors duration-200 no-underline ${
                                        location.pathname === "/settings" && location.search.includes(item.tab)
                                            ? "bg-purple-100 text-purple-700"
                                            : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                                    }`
                                }
                            >
                                <i className={`${item.icon} ${location.pathname === "/settings" && location.search.includes(item.tab) ? 'text-purple-600' : 'text-purple-400'} w-[20px] text-center`}></i>
                                {item.label}
                            </NavLink>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
