import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import study from "../assets/study.svg"
import tatu from "../assets/tatu.png"

export default function Login() {
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
                            placeholder="Loginni kiriting"
                            className="w-full h-[50px] p-[15px] border border-gray-300 rounded-[10px] outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                        <label className="font-[500] text-gray-700">Parol</label>
                        <input
                            type="password"
                            placeholder="Parolni kiriting"
                            className="w-full h-[50px] px-[15px] border border-gray-300 rounded-[10px] outline-none "
                        />
                    </div>

                    <div className="pt-2">
                        <Link to="/main">
                            <Button
                                variant="contained"
                                className="w-full h-[50px] hover:bg-[#1565c0] text-base font-[500] shadow-none"
                                style={{ width: '100%', height: '50px' }}
                            >
                                Kirish
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}