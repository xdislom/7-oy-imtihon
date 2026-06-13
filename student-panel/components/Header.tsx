"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconButton, Tooltip } from "@mui/material";

interface Props {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("O'zbekcha");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem("theme", newValue ? "dark" : "light");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages = ["O'zbekcha", "Русский", "English"];

  const handleLangSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setIsLangOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-[20px] gap-4">
      {/* Left Side: Menu Toggle (Mobile), Search, Calendar, Plus */}
      <div className="flex items-center gap-[10px] w-full md:w-auto">
        <IconButton onClick={onMenuClick} className="md:!hidden" sx={{ color: "#7c3aed" }}>
          <i className="fa-solid fa-bars"></i>
        </IconButton>

        <div className="hidden md:flex items-center gap-[15px]">
          <button className="flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fa-regular fa-calendar text-[22px]"></i>
          </button>

          <button className="flex items-center gap-2 px-4 py-[10px] bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-[12px] shadow-md hover:shadow-lg transition-all active:scale-95">
            <i className="fa-solid fa-plus text-[16px]"></i>
            <span className="font-[600] text-[15px]">Qo&apos;shish</span>
            <i className="fa-solid fa-chevron-down text-[12px] ml-1 opacity-80"></i>
          </button>

          <div className="relative w-[280px]">
            <i className="fa-solid fa-magnifying-glass absolute left-[15px] top-[13px] text-gray-300 text-[14px]"></i>
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-[45px] pr-[15px] py-[10px] bg-white border border-gray-100 rounded-[12px] outline-none shadow-sm focus:border-purple-300 transition-all text-[14px] text-gray-600"
            />
          </div>
        </div>

        {/* Mobile visible elements */}
        <div className="md:hidden flex items-center gap-2">
          <Image src="/assets/logo.jpg" alt="najot" width={35} height={35} className="w-[35px]" />
          <span className="text-[18px] text-purple-500 font-[600]">NajotEdu</span>
        </div>
      </div>

      {/* Right Side: Language, Notification, Theme, Avatar */}
      <div className="flex items-center gap-[15px] ml-auto">
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-[10px] px-[16px] py-[8px] bg-white border border-gray-100 rounded-[12px] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors select-none"
          >
            <span className="text-[14px] font-[500] text-gray-700">{selectedLanguage}</span>
            <i
              className={`fa-solid fa-chevron-down text-[12px] text-gray-400 transition-transform duration-200 ${
                isLangOpen ? "rotate-180" : ""
              }`}
            ></i>
          </div>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-[140px] bg-white border border-gray-100 rounded-[12px] shadow-lg py-1 z-[999] animate-fade-in">
              {languages.map((lang) => (
                <div
                  key={lang}
                  onClick={() => handleLangSelect(lang)}
                  className={`px-[16px] py-[8px] text-[14px] text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors ${
                    selectedLanguage === lang ? "bg-purple-50/50 text-purple-600 font-[600]" : ""
                  }`}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Tooltip title="Notification">
            <IconButton sx={{ color: "#4b5563", p: 0.5 }}>
              <i className="fa-regular fa-bell text-[20px]"></i>
            </IconButton>
          </Tooltip>
          <IconButton sx={{ color: "#4b5563", p: 0.5 }} onClick={toggleDarkMode}>
            <i
              className={`fa-regular fa-${isDark ? "sun" : "moon"} text-[20px] ${
                isDark ? "text-amber-500" : ""
              }`}
            ></i>
          </IconButton>
          <div
            onClick={handleLogout}
            title="Chiqish (Logout)"
            className="w-[42px] h-[42px] bg-[#7c3aed] rounded-full flex items-center justify-center text-white font-[600] text-[18px] shadow-sm cursor-pointer hover:bg-purple-700 hover:scale-105 transition-all"
          >
            I
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.15s ease-out;
        }
      `,
      }} />
    </div>
  );
}
