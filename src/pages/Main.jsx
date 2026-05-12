import { red } from "@mui/material/colors"
import educoin from "../assets/educoin.jpg"
import { Button } from "@mui/material"
import Avatar from '@mui/material/Avatar';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent('#fff')}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent('#fff')}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        borderRadius: 20 / 2,
    },
}));

export default function Main() {
    return (
        <div className="max-w-[1600px] m-auto">
            <div className="flex flex-col md:flex-row">

                <div className="hidden md:block w-[300px] h-[825px] p-[20px]">
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

                <div className="w-full min-h-screen md:pl-[30px] p-[15px] md:p-0 bg-gray-100 pb-[40px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="md:hidden flex items-center mb-4">
                            <img src={educoin} alt="educoin" className="w-[40px]" />
                            <span className="text-[20px] text-purple-500 font-[500] ml-[5px]">EduCoin</span>
                        </div>

                        <div className="flex items-center gap-[5px] ml-auto sm:mt-0">
                            <div className="w-[150px]">
                                <Accordion
                                    disableGutters
                                    elevation={0}
                                    sx={{ border: '1px solid gray', borderRadius: '20px' }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <p className="text-[14px] font-[500]">O'zbekcha</p>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ borderTop: '1px solid gray' }}>
                                        <p className="text-[14px] font-[500]">Ruscha</p>
                                        <p className="text-[14px] font-[500]">Ingilizcha</p>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div className="rounded-[8px] flex items-center p-1">
                                <Tooltip title="Notification">
                                    <IconButton sx={{ color: 'gray' }}>
                                        <NotificationsIcon />
                                    </IconButton>
                                </Tooltip>
                                <FormControlLabel
                                    control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
                                    className="!m-0"
                                />
                                <Avatar alt="Islom Iskandarov" src="/static/images/avatar/1.jpg" className="!bg-pink-500 ml-1" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-[28px] font-[600] mt-10 md:mt-[-20px]">Salom, creater!</h2>
                    <p className="text-gray-600 font-[500]">EduCoin platformasiga xush kelibsiz!</p>

                    <div className="flex flex-col lg:flex-row gap-[20px] mt-[40px]">
                        <div className="w-full lg:w-[350px] h-[180px] rounded-[20px] bg-white flex flex-col items-center justify-center">
                            <i className="fa-solid fa-user-group text-purple-500"></i>
                            <h5 className="pt-[10px]">Sinflar</h5>
                            <h6 className="pt-[10px] font-bold">0</h6>
                        </div>
                        <div className="w-full lg:w-[350px] h-[180px] rounded-[20px] bg-white flex flex-col items-center justify-center">
                            <i className="fa-solid fa-book-open text-purple-500"></i>
                            <h5 className="pt-[10px]">Fanlar</h5>
                            <h6 className="pt-[10px] font-[500]">0</h6>
                        </div>
                        <div className="w-full lg:w-[350px] h-[180px] rounded-[20px] bg-white flex flex-col items-center justify-center">
                            <i className="fa-solid fa-user-graduate text-purple-500"></i>
                            <h5 className="pt-[10px]">Talabalar</h5>
                            <h6 className="pt-[10px] font-[500]">1</h6>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-[20px] mt-[20px]">
                        <div className="w-full lg:w-[350px] h-[180px] rounded-[20px] bg-white flex flex-col items-center justify-center">
                            <i className="fa-solid fa-gift text-purple-500"></i>
                            <h5 className="pt-[10px]">Sovg'alar</h5>
                            <h6 className="pt-[10px] font-[500]">3</h6>
                        </div>
                        <div className="w-full lg:w-[350px] h-[180px] rounded-[20px] bg-white flex flex-col items-center justify-center">
                            <i className="fa-solid fa-user-check text-purple-500"></i>
                            <h5 className="pt-[10px]">O'qituvchilar</h5>
                            <h6 className="pt-[10px] font-[500]">0</h6>
                        </div>
                    </div>

                    <div className="mt-[40px] pr-[30px]">
                        <Accordion
                            disableGutters
                            elevation={0}
                            sx={{ border: '1px solid #e0e0e0', borderRadius: '20px' }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <p className="text-[14px] font-[500]">Dars Jadvali</p>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: '1px solid #e0e0e0' }}>
                                <p className="flex justify-between text-[16px] font-[500] bg-gray-100 pl-[10px] pt-[10px] h-[40px] rounded-[15px]">N105 ga bugun dars <span className="text-purple-600 font-[500] pr-[10px]">16:00</span></p>
                                <p className="flex justify-between text-[16px] font-[500] bg-gray-100 pl-[10px] pt-[10px] h-[40px] rounded-[15px] mt-[7px]">N26 ga ertaga dars <span className="text-purple-600 font-[500] pr-[10px]">19:00</span></p>
                                <p className="flex justify-between text-[16px] font-[500] bg-gray-100 pl-[10px] pt-[10px] h-[40px] rounded-[15px] mt-[7px]">N106 Dushanba kuni <span className="text-purple-600 font-[500] pr-[10px]">16:00</span></p>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}