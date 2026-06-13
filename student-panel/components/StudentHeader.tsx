"use client";

import { useRouter } from "next/navigation";

interface Props {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  onSidebarClose: () => void;
}

export default function StudentHeader({ onMenuClick, isSidebarOpen, onSidebarClose }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("student_token");
    router.push("/login");
  };

  return (
    <div className="bg-[#f8f9fa] h-[70px] flex items-center justify-between px-6 sticky top-0 z-50">
      <div>
        <button
          onClick={isSidebarOpen ? onSidebarClose : onMenuClick}
          className="w-[42px] h-[36px] rounded-[8px] bg-[#c59c73] flex flex-col items-center justify-center gap-1.5 hover:bg-[#b08d65] transition-colors shadow-sm"
        >
          <div className="w-[20px] h-[2px] bg-white rounded-full"></div>
          <div className="w-[20px] h-[2px] bg-white rounded-full"></div>
          <div className="w-[20px] h-[2px] bg-white rounded-full"></div>
        </button>
      </div>
      <div className="flex items-center gap-6 text-gray-500">
        <button className="hover:text-gray-800 transition-colors relative">
          <i className="fa-solid fa-bell text-[22px]"></i>
        </button>
        <button onClick={handleLogout} className="hover:text-gray-800 transition-colors">
          <i className="fa-solid fa-arrow-right-from-bracket text-[22px]"></i>
        </button>
      </div>
    </div>
  );
}
