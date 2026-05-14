import { NavLink, useLocation } from 'react-router-dom'
import { Button, IconButton } from "@mui/material"
import { useState } from "react"
import najot from "../assets/logo.jpg"

const navItems = [
    { to: "/dashboard", icon: "fa-solid fa-house", label: "Asosiy" },
    { to: "/teachers", icon: "fa-solid fa-user-tie", label: "O'qituvchilar" },
    { to: "/classes", icon: "fa-solid fa-book-journal-whills", label: "Sinflar" },
    { to: "/students", icon: "fa-solid fa-user-graduate", label: "Talabalar" },
    { to: "/gifts", icon: "fa-regular fa-gem", label: "Sovg'alar" },
    { to: "/settings", icon: "fa-solid fa-sliders", label: "Boshqarish" },
]

const settingsSubmenu = [
    { icon: "fa-solid fa-graduation-cap", label: "Kurslar",      tab: "Kurslar" },
    { icon: "fa-solid fa-door-open",      label: "Xonalar",      tab: "Xonalar" },
    { icon: "fa-solid fa-building",       label: "Filiallar",    tab: "Filiallar" },
    { icon: "fa-solid fa-user-tag",       label: "Hodimlar",     tab: "Hodimlar" },
    { icon: "fa-solid fa-shield-halved",  label: "Rollar",       tab: "Rollar" },
]

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation()
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

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

            {/* Mobile Sidebar Overlay (Backdrop) */}
            {isOpen && !isSubmenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[100] md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed md:sticky top-0 left-0 z-[101] h-screen bg-white transition-all duration-300 flex shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Main Sidebar */}
                <div className="w-[280px] h-full p-[20px] flex flex-col justify-between border-r border-gray-100 bg-white z-[102]">
                    <ul className="list-none p-0 m-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={najot} alt="najot" className="w-[40px]" />
                                <li className="text-[24px] text-purple-500 font-[500] pt-[7px] ml-2">NajotEdu</li>
                            </div>
                            <IconButton onClick={onClose} className="md:!hidden">
                                <i className="fa-solid fa-xmark text-gray-400"></i>
                            </IconButton>
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
                                    `text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] h-[50px] cursor-pointer transition-colors duration-200 no-underline ${
                                        isActive && !isSubmenuOpen
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-800 hover:bg-purple-600 hover:text-white"
                                    } ${item.to === "/settings" && isSubmenuOpen ? "bg-purple-600 text-white" : ""}`
                                }
                            >
                                <i className={`${item.icon} pt-[5px]`}></i>
                                {item.label}
                            </NavLink>
                        ))}
                    </ul>
                    <div className="w-full rounded-[20px] p-[15px] bg-gray-50 border border-gray-100 mt-4">
                        <div className="flex items-center gap-[10px]">
                            <div className="w-[40px] h-[40px] bg-purple-100 rounded-[10px] flex items-center justify-center">
                                <i className="fa-solid fa-crown text-purple-600"></i>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-[600] m-0">Obuna</h4>
                                <h5 className="text-red-400 text-[12px] font-[500] m-0">Muddati tugagan</h5>
                            </div>
                        </div>
                        <Button variant="contained" fullWidth sx={{
                            bgcolor: '#ef4444',
                            '&:hover': { bgcolor: '#dc2626' },
                            marginTop: 2,
                            fontSize: 12,
                            textTransform: 'none',
                            borderRadius: '10px',
                            gap: 1
                        }}>
                            <i className="fa-solid fa-bolt"></i> Yangilash
                        </Button>
                    </div>
                </div>

                {/* Settings Submenu Panel (Overlay) */}
                <div className={`
                    fixed md:absolute top-0 left-[280px] z-[101] w-[240px] h-full bg-gray-50 border-r border-gray-100 p-[20px] pt-[30px] transition-all duration-300
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
