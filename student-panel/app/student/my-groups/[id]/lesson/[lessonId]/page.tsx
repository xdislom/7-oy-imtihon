"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { mockTopics } from "@/lib/mockData";
import type { Video, Topic } from "@/types";

import { useParams } from "next/navigation";

export default function StudentLessonDetailPage() {
  const params = useParams() as { id: string; lessonId: string };
  const router = useRouter();

  const [activeTopicId, setActiveTopicId] = useState<number>(
    parseInt(params.lessonId) || mockTopics[0].id
  );
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState("Vazifalar");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const topic = mockTopics.find((t) => t.id === activeTopicId);
    if (topic) {
      if (topic.videos.length > 0) {
        setOpenAccordionId(topic.id);
        setActiveVideo(topic.videos[0]);
      } else {
        setOpenAccordionId(null);
        setActiveVideo(null);
      }
    }
  }, [activeTopicId]);

  const handleTopicClick = (topic: Topic) => {
    if (topic.videos.length === 0) {
      setActiveTopicId(topic.id);
    } else {
      if (openAccordionId === topic.id) {
        setOpenAccordionId(null);
      } else {
        setActiveTopicId(topic.id);
      }
    }
  };

  const handleVideoClick = (e: React.MouseEvent, topicId: number, video: Video) => {
    e.stopPropagation();
    setActiveTopicId(topicId);
    setActiveVideo(video);
  };

  const activeTopic = mockTopics.find((t) => t.id === activeTopicId) || mockTopics[0];

  return (
    <div className="p-[20px] md:p-[30px] flex flex-col lg:flex-row gap-6">
      {/* Left Main Content */}
      <div
        className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scroll"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => router.push(`/student/my-groups/${params.id}`)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-gray-600"></i>
          </button>
          <span className="text-gray-500 font-medium">Ortga</span>
        </div>

        {/* Video Player Area */}
        <div
          className="bg-white rounded-[12px] shadow-sm flex flex-col overflow-hidden relative"
          style={{ minHeight: "400px" }}
        >
          {activeVideo ? (
            <div className="w-full h-[400px] bg-black">
              <iframe
                src={activeVideo.url}
                title="Video player"
                className="w-full h-full border-0"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white">
              <div className="w-[120px] mb-6 opacity-30">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M50 20 L80 40 L50 60 L20 40 Z"
                    stroke="#c6a27a"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 60 L50 80 L80 60"
                    stroke="#c6a27a"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M50 20 L50 80"
                    stroke="#c6a27a"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-[24px] font-bold text-gray-800">Video mavjud emas</h2>
            </div>
          )}
        </div>

        {/* Topic Title */}
        <div className="bg-white rounded-[12px] shadow-sm p-5 shrink-0">
          <h2 className="text-[18px] font-bold text-gray-800">{activeTopic.title}</h2>
        </div>

        {/* Tabs */}
        <div
          className="bg-white rounded-[12px] shadow-sm flex flex-col shrink-0"
          style={{ minHeight: "300px" }}
        >
          <div className="flex border-b border-gray-100 px-2 shrink-0 justify-between items-center">
            <div className="flex">
              <button
                className={`px-6 py-4 text-[15px] font-medium transition-colors relative ${
                  activeTab === "Vazifalar" ? "text-[#c6a27a]" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Vazifalar")}
              >
                Vazifalar
                {activeTab === "Vazifalar" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c6a27a]"></div>
                )}
              </button>
            </div>
            {activeTab === "Vazifalar" &&
              activeTopic.homeworkDetails &&
              activeTopic.homeworkDetails.score !== undefined && (
                <div className="text-gray-500 font-medium text-[15px] pr-4">
                  Ball: {activeTopic.homeworkDetails.score}
                </div>
              )}
          </div>
          <div className="p-6 bg-[#fafafa] rounded-b-[12px]">
            {activeTab === "Vazifalar" ? (
              activeTopic.homeworkDetails ? (
                <div className="flex flex-col gap-4">
                  {/* Task Card */}
                  <div className="bg-[#fcfaf8] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col relative">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-[18px] font-[500] text-gray-800">
                        {activeTopic.homeworkDetails.task.title}
                      </h3>
                      <div className="absolute left-1/2 -translate-x-1/2 top-4">
                        {activeTopic.homeworkDetails.task.deadlineStatus === "warning" ? (
                          <div className="bg-[#fdf8e9] text-[#b4862a] rounded-[4px] px-4 py-2 flex items-center gap-2 text-[13px] font-[500] shadow-sm">
                            <i className="fa-solid fa-triangle-exclamation text-[14px]"></i>
                            {activeTopic.homeworkDetails.task.deadline}
                          </div>
                        ) : (
                          <div className="bg-[#f04445] text-white rounded-[4px] px-4 py-2 flex items-center gap-2 text-[13px] font-[500] shadow-sm">
                            <i className="fa-solid fa-circle-exclamation text-[14px]"></i>
                            {activeTopic.homeworkDetails.task.deadline}
                          </div>
                        )}
                      </div>
                      <span className="text-gray-600 text-[14px]">
                        Fayllar soni: {activeTopic.homeworkDetails.task.fileCount}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[14px] leading-[1.8] mt-2 whitespace-pre-line">
                      {activeTopic.homeworkDetails.task.description}
                    </p>

                    {activeTopic.homeworkDetails.task.attachment && (
                      <div className="mt-6">
                        <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-[8px] p-4 shadow-sm w-full max-w-[300px] hover:shadow-md transition-shadow cursor-pointer">
                          <i className="fa-regular fa-file-lines text-gray-400 text-[20px]"></i>
                          <span className="text-gray-700 text-[14px] font-medium">
                            {activeTopic.homeworkDetails.task.attachment.name}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="text-right text-gray-500 text-[13px] mt-6">
                      {activeTopic.homeworkDetails.task.date}
                    </div>
                  </div>

                  {/* Submission Card */}
                  {activeTopic.homeworkDetails.submission && (
                    <div className="bg-[#fcfaf8] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[18px] font-[500] text-gray-800">
                          {activeTopic.homeworkDetails.submission.title}
                        </h3>
                        <span className="text-gray-600 text-[14px]">
                          Fayllar soni: {activeTopic.homeworkDetails.submission.fileCount}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3 mt-2">
                        {activeTopic.homeworkDetails.submission.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-800 hover:text-blue-600 transition-colors text-[14px] truncate"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                      <div className="flex flex-col items-end mt-6 gap-2">
                        <span className="text-gray-500 text-[14px]">
                          {activeTopic.homeworkDetails.submission.date}
                        </span>
                        {activeTopic.homeworkDetails.submission.status && (
                          <span className="border border-gray-300 text-gray-500 rounded-[20px] px-3 py-1 text-[11px] font-medium">
                            {activeTopic.homeworkDetails.submission.status}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Feedback Card */}
                  {activeTopic.homeworkDetails.feedback && (
                    <div className="bg-[#fcfaf8] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[16px] font-[500] text-gray-800">
                          {activeTopic.homeworkDetails.feedback.title}
                        </h3>
                        <span
                          className={`text-[14px] font-medium ${
                            activeTopic.homeworkDetails.feedback.status === "Vazifa qabul qilindi"
                              ? "text-green-600"
                              : "text-[#f04445]"
                          }`}
                        >
                          {activeTopic.homeworkDetails.feedback.status}
                        </span>
                      </div>

                      {activeTopic.homeworkDetails.feedback.warning && (
                        <div className="bg-[#fdf8e9] text-[#b4862a] rounded-[8px] p-3.5 mt-6 flex items-start gap-3 text-[14px] shadow-sm border border-[#f5ebce] max-w-[500px]">
                          <i className="fa-solid fa-triangle-exclamation mt-0.5 text-[16px]"></i>
                          <span>{activeTopic.homeworkDetails.feedback.warning}</span>
                        </div>
                      )}

                      <p className="text-gray-700 text-[15px] mt-6 whitespace-pre-line">
                        {activeTopic.homeworkDetails.feedback.comment}
                      </p>
                      <p className="text-gray-600 text-[14px] mt-6">
                        Tekshiruvchi: {activeTopic.homeworkDetails.feedback.checker}
                      </p>

                      <div className="text-right text-gray-600 text-[14px] mt-6">
                        {activeTopic.homeworkDetails.feedback.date}
                      </div>
                    </div>
                  )}

                  {/* Footer Message */}
                  {activeTopic.homeworkDetails.footerMessage && (
                    <div className="text-center text-gray-600 text-[15px] mt-4 mb-2 font-medium">
                      {activeTopic.homeworkDetails.footerMessage}
                    </div>
                  )}

                  {/* Unfinished / Submission Input */}
                  {activeTopic.hwStatus === "Bajarilmagan" && (
                    <div className="flex flex-col gap-2 mt-4">
                      {selectedFile && (
                        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-[8px] px-4 py-2.5 shadow-sm w-fit">
                          <i className="fa-regular fa-file-lines text-[#c6a27a] text-[16px]"></i>
                          <span className="text-gray-700 text-[13px] font-medium">
                            {selectedFile.name}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <i className="fa-solid fa-xmark text-[13px]"></i>
                          </button>
                        </div>
                      )}
                      <div className="bg-white border border-gray-100 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-4 flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="Fayl biriktiring va izoh qoldiring"
                          value={comment}
                          onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                          className="flex-1 outline-none text-[15px] text-gray-700 placeholder:text-gray-400 px-2 bg-transparent"
                        />
                        <div className="flex items-center gap-4 text-gray-500 pl-4 border-l border-gray-100 shrink-0">
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                            }}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="hover:text-[#c6a27a] transition-colors"
                          >
                            <i className="fa-solid fa-paperclip text-[18px]"></i>
                          </button>
                          <button className="hover:text-[#c6a27a] transition-colors">
                            <i className="fa-solid fa-paper-plane text-[18px]"></i>
                          </button>
                        </div>
                      </div>
                      <div className="text-right text-gray-500 text-[14px] pr-2">
                        {comment.length} / 1000
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-[14px]">
                  Ushbu dars uchun vazifalar hozircha yo&apos;q...
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Topics Accordion */}
      <div
        className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-2"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {mockTopics.map((topic) => {
          const isAccordion = topic.videos.length > 0;
          const isOpen = openAccordionId === topic.id;
          const isSelected = activeTopicId === topic.id;

          return (
            <div key={topic.id} className="flex flex-col">
              <div
                onClick={() => handleTopicClick(topic)}
                className={`
                  flex items-center justify-between p-5 rounded-[16px] cursor-pointer transition-all
                  ${isSelected ? "bg-[#faeedd]" : "bg-[#fdfcfb]"}
                `}
              >
                <div className="flex flex-col gap-1">
                  <h3
                    className={`font-bold text-[15px] ${
                      isSelected ? "text-gray-900" : "text-gray-800"
                    }`}
                  >
                    {topic.title}
                  </h3>
                  <span className="text-[12px] text-gray-500">Dars sanasi: {topic.date}</span>
                </div>
                {isAccordion && (
                  <div
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <i className="fa-solid fa-chevron-down text-gray-400 text-[12px]"></i>
                  </div>
                )}
              </div>

              {/* Videos inside Accordion */}
              {isAccordion && isOpen && (
                <div className="mt-2 pl-4 pr-2 flex flex-col gap-2 mb-2 animate-fadeIn">
                  {topic.videos.map((video, idx) => (
                    <div
                      key={video.id}
                      onClick={(e) => handleVideoClick(e, topic.id, video)}
                      className={`
                        flex items-center gap-3 p-3 rounded-[8px] cursor-pointer transition-all
                        ${
                          activeVideo?.id === video.id
                            ? "bg-[#fff] border border-[#c6a27a] shadow-sm"
                            : "hover:bg-[#f3f4f6]"
                        }
                      `}
                    >
                      <div className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <i
                          className={`fa-solid fa-play text-[10px] ${
                            activeVideo?.id === video.id ? "text-[#c6a27a]" : "text-gray-400"
                          }`}
                        ></i>
                      </div>
                      <span
                        className={`text-[14px] font-medium ${
                          activeVideo?.id === video.id ? "text-[#c6a27a]" : "text-gray-700"
                        }`}
                      >
                        {idx + 1}. {video.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
