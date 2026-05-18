import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
import { useState } from "react"
import study from "../assets/study.svg"
import tatu from "../assets/tatu.png"

export default function Login() {
    const navigate = useNavigate()
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        console.log("Yuborilayotgan data:", { phone, password })
        try {
            setLoading(true)
            setError("")
            const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, password })
            })

            const data = await response.json()
            console.log("Server javobi:", data)

            if (response.ok) {
                localStorage.setItem("token", data.token || data.access_token)
                navigate("/dashboard")
            } else {
                setError(data.message || "Telefon yoki parol noto'g'ri!")
            }
        } catch (error) {
            setError("Server bilan bog'lanishda xatolik!")
        } finally {
            setLoading(false)
        }
    }

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
                        <label className="font-[500] text-gray-700">Telefon raqam</label>
                        <input
                            type="text"
                            placeholder="Telefon raqamni kiriting"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-[50px] p-[15px] border border-gray-300 rounded-[10px] outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <label className="font-[500] text-gray-700">Parol</label>
                        <input
                            type="password"
                            placeholder="Parolni kiriting"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[50px] px-[15px] border border-gray-300 rounded-[10px] outline-none"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[14px] font-[500]">{error}</p>
                    )}

                    <div className="pt-2">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full h-[50px] hover:bg-[#1565c0] text-base font-[500] shadow-none"
                            style={{ width: '100%', height: '50px' }}
                        >
                            {loading ? "Yuklanmoqda..." : "Kirish"}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}