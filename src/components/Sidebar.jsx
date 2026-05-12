import { NavLink, useLocation } from 'react-router-dom'
import { Button } from "@mui/material"
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
    { icon: "fa-solid fa-circle-exclamation", label: "Sabablar", tab: "Sabablar" },
    { icon: "fa-solid fa-shield-halved",  label: "Rollar",       tab: "Rollar" },
    { icon: "fa-solid fa-coins",          label: "Coin",         tab: "Coin" },
    { icon: "fa-solid fa-paper-plane",    label: "Xabar yuborish", tab: "Xabar yuborish" },
    { icon: "fa-solid fa-circle-question",label: "FAQ",          tab: "FAQ" },
    { icon: "fa-solid fa-clipboard-check",label: "Tekshiruv",    tab: "Tekshiruv" },
]

export default function Sidebar() {
    const location = useLocation()
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(true)
    const isSettings = location.pathname === "/settings"

    const handleBoshqarishClick = (e) => {
        if (isSettings) {
            e.preventDefault()
            setIsSubmenuOpen(!isSubmenuOpen)
        } else {
            setIsSubmenuOpen(true)
        }
    }

    const handleSubmenuItemClick = () => {
        setIsSubmenuOpen(false) // Ichki bo'lim tanlanganda menyuni yopamiz
    }

    return (
        <div className="hidden md:flex shrink-0">
            {/* Main Sidebar */}
            <div className="w-[280px] min-h-screen p-[20px] flex flex-col justify-between border-r border-gray-100">
                <ul className="list-none p-0 m-0">
                    <div className="flex items-center">
                        <img src={najot} alt="najot" className="w-[40px]" />
                        <li className="text-[24px] text-purple-500 font-[500] pt-[7px] ml-2">NajotEdu</li>
                    </div>
                    <hr className="w-[200px] mt-2 mb-2" />
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={item.to === "/settings" ? handleBoshqarishClick : undefined}
                            className={({ isActive }) =>
                                `text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] h-[50px] cursor-pointer transition-colors duration-200 no-underline ${
                                    isActive
                                        ? "bg-purple-600 text-white"
                                        : "text-gray-800 hover:bg-purple-600 hover:text-white"
                                }`
                            }
                        >
                            <i className={`${item.icon} pt-[5px]`}></i>
                            {item.label}
                        </NavLink>
                    ))}
                </ul>
                <div className="w-[240px] rounded-[20px] p-[15px] bg-gray-100 border border-[1px]">
                    <div className="flex items-center gap-[10px]">
                        <i className="fa-solid fa-book-tanakh text-[30px]"></i>
                        <div>
                            <h4 className="text-[14px] font-[600] m-0">Obuna</h4>
                            <h5 className="text-red-400 text-[12px] font-[500] m-0">Obunangiz tugagan</h5>
                        </div>
                    </div>
                    <Button variant="contained" sx={{
                        bgcolor: 'red',
                        marginTop: 1.5,
                        fontSize: 12,
                        display: "flex",
                        gap: 1,
                        width: "100%",
                        height: "36px"
                    }}><i className="fa-solid fa-bolt"></i> Obunani yangilash</Button>
                </div>
            </div>

            {/* Settings Submenu Panel */}
            {isSettings && isSubmenuOpen && (
                <div className="w-[240px] min-h-screen bg-white border-l border-gray-100 p-[20px] pt-[80px] transition-all duration-300">
                    <ul className="list-none p-0 m-0">
                        {settingsSubmenu.map((item) => (
                            <NavLink
                                key={item.tab}
                                to={`/settings?tab=${item.tab}`}
                                onClick={handleSubmenuItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-[12px] text-[16px] font-[500] px-[15px] py-[12px] rounded-[10px] mt-[6px] cursor-pointer transition-colors duration-200 no-underline ${
                                        location.search.includes(item.tab)
                                            ? "bg-purple-100 text-purple-700"
                                            : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                                    }`
                                }
                            >
                                <i className={`${item.icon} ${location.search.includes(item.tab) ? 'text-purple-600' : 'text-purple-400'} w-[20px] text-center`}></i>
                                {item.label}
                            </NavLink>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
