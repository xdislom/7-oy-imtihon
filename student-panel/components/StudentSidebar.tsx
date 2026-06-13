"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { href: "/student/home", icon: "fa-solid fa-house", label: "Bosh sahifa" },
  { href: "/student/payments", icon: "fa-regular fa-credit-card", label: "To'lovlarim" },
  { href: "/student/my-groups", icon: "fa-solid fa-users", label: "Guruhlarim" },
  { href: "/student/stats", icon: "fa-solid fa-chart-simple", label: "Ko'rsatgichlarim" },
  { href: "/student/rating", icon: "fa-solid fa-chart-column", label: "Reyting" },
  { href: "/student/shop", icon: "fa-solid fa-cart-shopping", label: "Do'kon" },
  { href: "/student/extra", icon: "fa-solid fa-podcast", label: "Qo'shimcha darslar" },
  { href: "/student/settings", icon: "fa-solid fa-gear", label: "Sozlamalar" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed md:sticky top-0 left-0 z-[101] h-screen bg-white transition-all duration-300 flex flex-col shrink-0 w-[260px] border-r border-gray-100 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-2 relative">
            <span className="font-bold text-[18px] text-gray-800 tracking-wider">NAJOT</span>
            <div className="w-[28px] h-[28px] rounded-full bg-[#c6a27a] flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-white text-[13px]"></i>
            </div>
            <span className="font-bold text-[18px] text-gray-800 tracking-wider">TA&apos;LIM</span>
            <span className="absolute -top-2 -right-8 bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[6px]">
              Beta
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-[12px] transition-all no-underline font-medium ${
                  active
                    ? "bg-[#fff7ed] text-[#ea580c]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="w-[24px] flex justify-center">
                  <i className={`${item.icon} text-[18px]`}></i>
                </div>
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
