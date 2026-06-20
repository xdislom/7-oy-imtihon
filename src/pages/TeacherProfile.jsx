import { useEffect, useState } from 'react'
import TeacherSidebar from "../components/TeacherSidebar"
import Header from "../components/Header"

export default function TeacherProfile() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [profile, setProfile] = useState(null)
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token") || ""
            const endpoints = [
                "https://najot-edu.softwareengineer.uz/api/v1/teachers/my/profile",
                "https://najot-edu.softwareengineer.uz/api/v1/teachers/me",
                "https://najot-edu.softwareengineer.uz/api/v1/profile",
            ]
            for (const url of endpoints) {
                try {
                    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                    if (!res.ok) continue
                    const data = await res.json()
                    const d = data.data || data
                    if (d && (d.name || d.full_name || d.firstName || d.first_name || d.id)) {
                        setProfile(d)
                        if (d.groups && Array.isArray(d.groups)) {
                            setGroups(d.groups)
                        }
                        break
                    }
                } catch (_) {}
            }

            // Fetch groups if not already fetched from profile
            if (groups.length === 0) {
                const groupEndpoints = [
                    "https://najot-edu.softwareengineer.uz/api/v1/teachers/my/groups",
                "https://najot-edu.softwareengineer.uz/api/v1/groups/all",
            ]
            for (const url of groupEndpoints) {
                try {
                    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                    if (!res.ok) continue
                    const data = await res.json()
                    const arr = Array.isArray(data) ? data : (data.data || data.groups || [])
                    if (arr.length > 0) {
                        setGroups(arr.slice(0, 6))
                        break
                    }
                } catch (_) {}
            }
        }

            setLoading(false)
        }
        fetchProfile()
    }, [])

    const getName = () => {
        if (!profile) return "O'qituvchi"
        return profile.full_name || profile.name ||
            `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "O'qituvchi"
    }

    const getInitial = () => getName()[0]?.toUpperCase() || "T"

    const formatDate = (val) => {
        if (!val) return "—"
        try {
            return new Date(val).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
        } catch { return val }
    }

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="flex">
                <TeacherSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="w-full min-h-screen flex flex-col px-[20px] md:px-[40px] pb-[40px]">
                    <Header onMenuClick={() => setIsSidebarOpen(true)} />

                    <div className="mt-[20px] mb-[24px]">
                        <h2 className="text-[28px] font-[700] text-gray-900">Profil</h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <i className="fa-solid fa-spinner animate-spin text-[32px] text-purple-500"></i>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-0">
                                {/* Left — Avatar Card */}
                                <div className="md:w-[220px] bg-gradient-to-b from-purple-500 to-purple-600 flex flex-col items-center justify-center py-10 px-6 gap-4">
                                    <div className="w-[90px] h-[90px] rounded-full bg-white/30 flex items-center justify-center text-white text-[40px] font-[700] shadow-lg overflow-hidden border-4 border-white/50">
                                        {profile?.photo || profile?.avatar || profile?.image ? (
                                            <img
                                                src={profile.photo || profile.avatar || profile.image}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{getInitial()}</span>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-white font-[700] text-[18px] leading-tight">{getName()}</h3>
                                        <p className="text-white/80 text-[13px] mt-1">O'qituvchi</p>
                                    </div>
                                </div>

                                {/* Right — Info */}
                                <div className="flex-1 p-6 md:p-8">
                                    {/* Personal info */}
                                    <h4 className="text-[16px] font-[700] text-gray-800 mb-4">Shaxsiy ma'lumotlar</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="flex items-start gap-2">
                                            <div className="w-[32px] h-[32px] bg-purple-50 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                                                <i className="fa-regular fa-envelope text-purple-500 text-[12px]"></i>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-[500]">Email</p>
                                                <p className="text-[13px] text-gray-800 font-[600] break-all">
                                                    {profile?.email || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="w-[32px] h-[32px] bg-purple-50 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                                                <i className="fa-solid fa-phone text-purple-500 text-[12px]"></i>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-[500]">Telefon raqam</p>
                                                <p className="text-[13px] text-gray-800 font-[600]">
                                                    {profile?.phone || profile?.phone_number || profile?.phoneNumber || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="w-[32px] h-[32px] bg-purple-50 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                                                <i className="fa-solid fa-location-dot text-purple-500 text-[12px]"></i>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-[500]">Manzil</p>
                                                <p className="text-[13px] text-gray-800 font-[600]">
                                                    {profile?.address || profile?.city || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="w-[32px] h-[32px] bg-purple-50 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                                                <i className="fa-regular fa-calendar text-purple-500 text-[12px]"></i>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-[500]">Ro'yxatdan o'tgan sana</p>
                                                <p className="text-[13px] text-gray-800 font-[600]">
                                                    {formatDate(profile?.created_at || profile?.createdAt || profile?.registered_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Groups */}
                                    {groups.length > 0 && (
                                        <>
                                            <h4 className="text-[16px] font-[700] text-gray-800 mb-3">Guruhlar</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {groups.map((g, i) => (
                                                    <span
                                                        key={g.id || i}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-[12px] font-[600] border border-purple-100"
                                                    >
                                                        <i className="fa-solid fa-layer-group text-[10px]"></i>
                                                        {typeof g === 'string' ? g : (g.name || g.title || `Guruh ${i + 1}`)}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
