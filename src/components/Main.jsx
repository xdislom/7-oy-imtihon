import { red } from "@mui/material/colors"
import educoin from "../assets/educoin.jpg"
import { Button } from "@mui/material"

import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Main() {

    return (
        <div className="flex">
            
            <div className="w-[300px] h-[825px] p-[20px]">
                <ul>
                    <div className="flex">
                        <img src={educoin} alt="educoin" className="w-[50px]" />
                        <li className="text-[24px] text-purple-500 font-[500] pt-[7px]">EduCoin</li>
                    </div>
                    <hr className="w-[200px]" />
                    <li className="text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] hover:text-white h-[50px] hover:bg-purple-600 ">
                        <i className="fa-solid fa-house pt-[5px]"></i>
                        Asosiy
                    </li>
                    <li className="text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] hover:text-white h-[50px] hover:bg-purple-600 ">
                        <i className="fa-solid fa-user-tie pt-[5px]"></i>
                        O'qituvchilar
                    </li>
                    <li className="text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] hover:text-white h-[50px] hover:bg-purple-600 ">
                        <i className="fa-solid fa-book-journal-whills pt-[5px]"></i>
                        Sinflar
                    </li>
                    <li className="text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] hover:text-white h-[50px] hover:bg-purple-600 ">
                        <i className="fa-solid fa-user-graduate pt-[5px]"></i>
                        Talabalar
                    </li>
                    <li className="text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] hover:text-white h-[50px] hover:bg-purple-600 ">
                        <i className="fa-regular fa-gem pt-[5px]"></i>
                        Sovg'alar
                    </li>
                    <li className="text-[20px] font-[500] pl-[20px] pt-[10px] rounded-[10px] mt-[15px] flex gap-[10px] hover:text-white h-[50px] hover:bg-purple-600 ">
                        <i className="fa-solid fa-sliders pt-[5px]"></i>
                        Boshqarish
                    </li>
                </ul>
                <div className="w-[260px] h-[150px] rounded-[20px] p-[25px] bg-gray-100 border border-[1px] mt-[200px]">
                    <i className="fa-solid fa-book-tanakh text-[40px]"></i>
                    <h4 className="mt-[-50px] ml-[60px]">Obuna</h4>
                    <h5 className="text-red-400 text-[14px] font-[500] ml-[60px]">Obunangiz tugagan</h5>
                    <Button variant="contained" sx={{
                        bgcolor: 'red',
                        marginTop: 5,
                        fontSize: 13,
                        display: "flex",
                        gap: 1
                    }}><i className="fa-solid fa-bolt"></i> Obunani yangilash</Button>
                </div>
            </div>

            <div className="w-full h-[825px] pl-[30px] bg-gray-100">
                <h2 className="text-[28px] font-[600] pt-[70px]">Salom, creater!</h2>
                <p className="text-gray-600 font-[500]">EduCoin platformasiga xush kelibsiz!</p>

                <div className="flex gap-[10px]">
                    <div className="w-[350px] h-[200px] rounded-[20px] bg-white mt-[40px] pt-[50px]">
                        <i className="fa-solid fa-user-group pl-[165px] text-purple-500"></i>
                        <h5 className="text-center pt-[10px]">Sinflar</h5>
                        <h6 className="text-center pt-[10px]">0</h6>
                    </div>
                    <div className="w-[350px] h-[200px] rounded-[20px] bg-white mt-[40px] pt-[50px]">
                        <i className="fa-solid fa-book-open pl-[165px] text-purple-500"></i>
                        <h5 className="text-center pt-[10px]">Fanlar</h5>
                        <h6 className="text-center pt-[10px]">0</h6>
                    </div>
                    <div className="w-[350px] h-[200px] rounded-[20px] bg-white mt-[40px] pt-[50px]">
                        <i className="fa-solid fa-book-open pl-[165px] text-purple-500"></i>
                        <h5 className="text-center pt-[10px]">Talabalar</h5>
                        <h6 className="text-center pt-[10px]">1</h6>
                    </div>
                </div>
                <div className="flex gap-[10px]">
                    <div className="w-[350px] h-[200px] rounded-[20px] bg-white mt-[40px] pt-[50px]">
                        <i className="fa-solid fa-book-open pl-[165px] text-purple-500"></i>
                        <h5 className="text-center pt-[10px]">Sovg'alar</h5>
                        <h6 className="text-center pt-[10px]">3</h6>
                    </div>
                    <div className="w-[350px] h-[200px] rounded-[20px] bg-white mt-[40px] pt-[50px]">
                        <i className="fa-solid fa-book-open pl-[165px] text-purple-500"></i>
                        <h5 className="text-center pt-[10px]">O'qituvchilar</h5>
                        <h6 className="text-center pt-[10px]">0</h6>
                    </div>
                </div>
                <div className="mt-[20px]">
                    <Accordion
                        disableGutters
                        elevation={0}
                        sx={{ border: '1px solid #e0e0e0', borderRadius: '20px' }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <p className="text-[14px] font-[500]">
                                Dars Jadvali
                            </p>
                        </AccordionSummary>
                        <AccordionDetails sx={{ borderTop: '1px solid #e0e0e0' }}>
                            <p>Bu yerda dars yoq</p>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}