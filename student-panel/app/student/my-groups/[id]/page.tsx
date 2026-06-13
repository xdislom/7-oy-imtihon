"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockLessons, getStatusStyle } from "@/lib/mockData";
import { useParams } from "next/navigation";

export default function GroupDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("Barchasi");

  const filtered = statusFilter === "Barchasi"
    ? mockLessons
    : mockLessons.filter((l) => l.hwStatus === statusFilter);

  return (
    <div className="p-[20px] md:p-[30px]">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => router.push("/student/my-groups")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-gray-600"></i>
        </button>
        <h2 className="text-[20px] font-bold text-gray-800">n105</h2>
      </div>

      <div className="bg-white rounded-[12px] p-[24px] shadow-sm">
        {/* Filter */}
        <div className="mb-6 flex flex-col gap-2">
          <h3 className="text-[#8c94a3] font-[500] text-[15px]">Uy vazifa statusi</h3>
          <div className="relative inline-block w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full bg-white border border-[#c6a27a] text-gray-700 py-2 px-4 pr-8 rounded-[4px] leading-tight focus:outline-none focus:border-[#c6a27a] font-medium cursor-pointer"
            >
              <option>Barchasi</option>
              <option>Qaytarilgan</option>
              <option>Qabul qilingan</option>
              <option>Berilmagan</option>
              <option>Bajarilmagan</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-800">
              <i className="fa-solid fa-caret-down text-[14px]"></i>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[25%]">Mavzular</th>
                <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[15%]">Video</th>
                <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[20%]">Uyga vazifa Holati</th>
                <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[25%]">Uyga vazifa tugash vaqti</th>
                <th className="py-5 px-4 font-bold text-gray-900 text-[14px] w-[15%]">Dars sanasi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lesson) => (
                <tr
                  key={lesson.id}
                  onClick={() => router.push(`/student/my-groups/${params.id}/lesson/${lesson.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 text-gray-700 text-[14px] font-medium">{lesson.title}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full border border-[#60a5fa] text-[#60a5fa] text-[13px] font-medium">
                      {lesson.video}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center justify-center text-white text-[13px] font-medium px-4 py-1.5 rounded-[4px] min-w-[120px] ${getStatusStyle(lesson.hwStatus)}`}
                    >
                      {lesson.hwStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-[14px]">{lesson.hwDeadline}</td>
                  <td className="py-4 px-4 text-gray-700 text-[14px]">{lesson.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
