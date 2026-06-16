import { useNavigate } from "react-router-dom"
import { Button, Snackbar, Alert } from "@mui/material"
import { useState, useEffect, useRef } from "react"
import study from "../assets/study.svg"
import tatu from "../assets/tatu.png"

const findToken = (value) => {
    if (!value || typeof value !== 'object') return ""
    const token = value.token || value.access_token || value.accessToken
    if (typeof token === 'string') return token.replace(/^Bearer\s+/i, '')
    for (const key of Object.keys(value)) {
        const nestedToken = findToken(value[key])
        if (nestedToken) return nestedToken
    }
    return ""
}

export default function Login() {
    const navigate = useNavigate()
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // Modal 1 - Parolni tiklash
    const [forgotModal, setForgotModal] = useState(false)
    const [forgotPhone, setForgotPhone] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpError, setOtpError] = useState("")

    // Modal 2 - SMS kodni tasdiqlash
    const [otpModal, setOtpModal] = useState(false)
    const [smsCode, setSmsCode] = useState("")
    const [countdown, setCountdown] = useState(60)
    const timerRef = useRef(null)

    // Modal 3 - Yangi parol o'rnatish
    const [newPasswordModal, setNewPasswordModal] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [changePasswordLoading, setChangePasswordLoading] = useState(false)
    const [changePasswordError, setChangePasswordError] = useState("")

    useEffect(() => {
        localStorage.removeItem("token")
    }, [])

    // Countdown timer
    useEffect(() => {
        if (otpModal) {
            setCountdown(60)
            timerRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [otpModal])

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, password })
            })
            const data = await response.json()
            if (response.ok) {
                const token = findToken(data)
                if (!token) { setError("Token topilmadi. Iltimos, qayta urinib ko'ring!"); return }
                localStorage.setItem("token", token)
                setSuccessMessage("Siz muvaffaqiyatli kirdingiz!")
                let userRole = data.role || (data.user && data.user.role) || data.roleName;
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    userRole = userRole || payload.role || payload.user_role || payload.roleName || payload.type || (payload.roles && payload.roles[0]);
                    if (userRole) localStorage.setItem("role", userRole);
                } catch (e) { console.error("Tokenni o'qishda xatolik:", e) }
                setTimeout(() => {
                    const roleStr = String(userRole || "").toLowerCase();
                    if (roleStr.includes("student") || roleStr.includes("pupil") || roleStr === "user") {
                        navigate("/student/home");
                    } else {
                        navigate("/dashboard");
                    }
                }, 1200)
            } else {
                setError(data.message || "Telefon yoki parol noto'g'ri!")
            }
        } catch {
            setError("Server bilan bog'lanishda xatolik!")
        } finally {
            setLoading(false)
        }
    }

    const handleSendOtp = async () => {
        if (!forgotPhone.trim()) { setOtpError("Telefon raqamini kiriting!"); return }
        
        let formattedPhone = forgotPhone;
        if (!formattedPhone.startsWith("+")) {
            formattedPhone = "+" + formattedPhone;
        }
        localStorage.setItem("resetPhone", formattedPhone);

        try {
            setOtpLoading(true)
            setOtpError("")
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formattedPhone })
            })
            if (response.ok) {
                setForgotModal(false)
                setOtpModal(true)
                setSmsCode("")
            } else {
                const data = await response.json().catch(() => ({}))
                setOtpError(data.message || "Xatolik yuz berdi. Qayta urinib ko'ring!")
            }
        } catch {
            setOtpError("Server bilan bog'lanishda xatolik!")
        } finally {
            setOtpLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (countdown > 0) return
        await handleSendOtp()
    }

    const handleVerifyOtp = async () => {
        if (!smsCode.trim()) { setOtpError("SMS kodni kiriting!"); return }
        
        const savedPhone = localStorage.getItem("resetPhone") || forgotPhone;
        
        try {
            setVerifyLoading(true)
            setOtpError("")
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: savedPhone, otp: smsCode })
            })
            if (response.ok) {
                setOtpModal(false)
                setNewPasswordModal(true)
                setNewPassword("")
                setConfirmPassword("")
            } else {
                const data = await response.json().catch(() => ({}))
                setOtpError(data.message || "Noto'g'ri kod. Qayta urinib ko'ring!")
            }
        } catch {
            setOtpError("Server bilan bog'lanishda xatolik!")
        } finally {
            setVerifyLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            setChangePasswordError("Parol kamida 6 ta belgidan iborat bo'lishi kerak!")
            return
        }
        if (newPassword !== confirmPassword) {
            setChangePasswordError("Parollar mos kelmadi!")
            return
        }
        
        try {
            setChangePasswordLoading(true)
            setChangePasswordError("")
            
            const savedPhone = localStorage.getItem("resetPhone") || forgotPhone;
            
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/auth/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: savedPhone, password: newPassword })
            })
            
            if (response.ok) {
                setNewPasswordModal(false)
                setSuccessMessage("Parolingiz muvaffaqiyatli o'zgartirildi!")
            } else {
                const data = await response.json().catch(() => ({}))
                setChangePasswordError(data.message || "Xatolik yuz berdi. Qayta urinib ko'ring!")
            }
        } catch {
            setChangePasswordError("Server bilan bog'lanishda xatolik!")
        } finally {
            setChangePasswordLoading(false)
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSuccessMessage("");
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">

            <div className="hidden md:flex md:w-[700px] bg-blue-900 items-center justify-center p-[30px]">
                <img src={study} alt="study" className="max-w-full h-auto object-contain" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-[20px] md:p-12 bg-white">

                <div className="max-w-[450px] w-full text-center space-y-6">
                    <h1 className="text-[16px] sm:text-[18px] sm:m-auto font-[500] w-[400px] m-auto mb-[10px]">
                        MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI
                    </h1>
                    <div className="flex justify-center">
                        <img src={tatu} alt="tatu" className="w-[80px] md:w-[100px] h-auto" />
                    </div>
                    <h2 className="text-[20px] md:text-[24px] font-[700] text-gray-900 tracking-wide">
                        LEARNING MANAGEMENT SYSTEM
                    </h2>
                </div>

                <div className="max-w-[450px] w-full mt-8 space-y-5">
                    <div className="flex flex-col gap-[5px]">
                        <label className="font-[500] text-gray-700">Login</label>
                        <input
                            type="text"
                            placeholder="998XXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-[50px] p-[15px] border border-gray-300 rounded-[10px] outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-[5px] relative">
                        <label className="font-[500] text-gray-700">Parol</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="XXXXXXXXXX"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[50px] px-[15px] pr-[45px] border border-gray-300 rounded-[10px] outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-[15px] top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </button>
                        <div className="flex justify-end mt-1">
                            <button
                                type="button"
                                onClick={() => { setForgotModal(true); setOtpError("") }}
                                className="text-[13px] text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                Parolni unutdingizmi?
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-[14px] font-[500]">{error}</p>}

                    <div className="pt-2">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{ width: '100%', height: '50px' }}
                        >
                            {loading ? "Yuklanmoqda..." : "Kirish"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Snackbar */}
            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* === MODAL 1: Parolni tiklash === */}
            {forgotModal && (
                <div
                    className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center"
                    onClick={() => setForgotModal(false)}
                >
                    <div
                        className="bg-white rounded-[12px] p-7 w-[90%] max-w-[420px] shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[20px] font-[700] text-gray-900 mb-3">Parolni tiklash</h3>
                        <p className="text-[14px] text-gray-600 mb-5 leading-relaxed">
                            Tizimda ro'yxatdan o'tgan telefon raqamingizni kiriting. Biz sizga tasdiqlash kodini yuboramiz.
                        </p>

                        <input
                            type="text"
                            placeholder="Telefon raqami"
                            value={forgotPhone}
                            onChange={(e) => setForgotPhone(e.target.value)}
                            className="w-full h-[46px] px-[14px] border border-gray-300 rounded-[8px] outline-none focus:border-gray-400 transition-colors text-[14px] text-gray-700"
                        />

                        {otpError && (
                            <p className="text-red-500 text-[13px] mt-2">{otpError}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setForgotModal(false); setForgotPhone(""); setOtpError("") }}
                                className="px-5 py-2 text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-[500]"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleSendOtp}
                                disabled={otpLoading}
                                className="px-5 py-2 text-[14px] bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white font-[500] rounded-[8px] transition-colors"
                            >
                                {otpLoading ? "Yuborilmoqda..." : "Kodni yuborish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL 2: SMS kodni tasdiqlash === */}
            {otpModal && (
                <div
                    className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center"
                    onClick={() => setOtpModal(false)}
                >
                    <div
                        className="bg-white rounded-[12px] p-7 w-[90%] max-w-[420px] shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[20px] font-[700] text-gray-900 mb-3">SMS kodni tasdiqlash</h3>
                        <p className="text-[14px] text-gray-600 mb-1">
                            Tasdiqlash kodi quyidagi raqamga yuborildi:{" "}
                            <span className="font-[600] text-gray-900">{forgotPhone}</span>
                        </p>
                        <button
                            onClick={() => { setOtpModal(false); setForgotModal(true) }}
                            className="text-[13px] text-blue-600 hover:underline mb-5 block"
                        >
                            O'zgartirish
                        </button>

                        <input
                            type="text"
                            placeholder="SMS Kod"
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            className="w-full h-[46px] px-[14px] border border-gray-300 rounded-[8px] outline-none focus:border-gray-400 transition-colors text-[14px] text-gray-700"
                        />

                        <p className="text-[13px] text-gray-600 mt-3">
                            Kodni qayta yuborish:{" "}
                            {countdown > 0 ? (
                                <span className="font-[700]">{countdown} soniya</span>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    className="font-[700] text-blue-600 hover:underline"
                                >
                                    Qayta yuborish
                                </button>
                            )}
                        </p>

                        {otpError && (
                            <p className="text-red-500 text-[13px] mt-2">{otpError}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setOtpModal(false); setSmsCode("") }}
                                className="px-5 py-2 text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-[500]"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={verifyLoading}
                                className="px-5 py-2 text-[14px] bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white font-[500] rounded-[8px] transition-colors"
                            >
                                {verifyLoading ? "Tekshirilmoqda..." : "Kodni tasdiqlash"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL 3: Yangi parol o'rnatish === */}
            {newPasswordModal && (
                <div
                    className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center"
                    onClick={() => setNewPasswordModal(false)}
                >
                    <div
                        className="bg-white rounded-[12px] p-7 w-[90%] max-w-[420px] shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[20px] font-[700] text-gray-900 mb-3">Yangi parol o'rnatish</h3>
                        <p className="text-[14px] text-gray-600 mb-5 leading-relaxed">
                            Hisobingiz uchun yangi xavfsiz parol kiriting.
                        </p>

                        <div className="flex flex-col gap-3">
                            <input
                                type="password"
                                placeholder="Yangi parol"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-[46px] px-[14px] border border-gray-300 rounded-[8px] outline-none focus:border-gray-400 transition-colors text-[14px] text-gray-700"
                            />
                            <input
                                type="password"
                                placeholder="Parolni tasdiqlash"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-[46px] px-[14px] border border-gray-300 rounded-[8px] outline-none focus:border-gray-400 transition-colors text-[14px] text-gray-700"
                            />
                        </div>

                        {changePasswordError && (
                            <p className="text-red-500 text-[13px] mt-2">{changePasswordError}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setNewPasswordModal(false); setNewPassword(""); setConfirmPassword(""); setChangePasswordError("") }}
                                className="px-5 py-2 text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-[500]"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={changePasswordLoading}
                                className="px-5 py-2 text-[14px] bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white font-[500] rounded-[8px] transition-colors"
                            >
                                {changePasswordLoading ? "Yangilanmoqda..." : "Parolni yangilash"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
