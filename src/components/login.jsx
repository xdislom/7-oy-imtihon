import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import study from "../assets/study.svg"
import tatu from "../assets/tatu.png"

export default function Login() {

    return (
        <div className="flex">
            <img src={study} alt="study" className="w-[750px] h-[825px] bg-blue-900" />
            <div>
                <h1 className="text-[18px] font-[400] w-[400px] text-center m-auto ml-[200px] mt-[180px]">MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI</h1>
                <img src={tatu} alt="tatu" className="w-[100px] ml-[350px] mt-[10px]" />
                <h2 className="text-[24px] font-[500] ml-[210px] mt-[30px]">LEARNING MANAGEMENT SYSTEM</h2>
                <div className="ml-[180px] mt-[15px]">
                    <h4>Login</h4>
                    <label>
                        <input type="phone" placeholder="Loginni kiriting" className="w-[450px] h-[50px] p-[15px] border border-1 rounded-[7px]" />
                    </label>

                    <h4 className="mt-[20px]">Parol</h4>
                    <label>
                        <input type="password" placeholder="Parolni kiriting" className="w-[450px] h-[50px] p-[15px] border border-1 rounded-[7px] mb-[20px]" />
                        <Link to="/main">
                            <Button variant="contained" className="w-[450px] h-[50px]">Kirish</Button>
                        </Link>
                    </label>
                </div>
            </div>
        </div>

    )
}