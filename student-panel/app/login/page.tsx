"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Snackbar, Alert } from "@mui/material";

const findToken = (value: any): string => {
  if (!value || typeof value !== "object") return "";

  const token = value.token || value.access_token || value.accessToken;
  if (typeof token === "string") return token.replace(/^Bearer\s+/i, "");

  for (const key of Object.keys(value)) {
    const nestedToken = findToken(value[key]);
    if (nestedToken) return nestedToken;
  }

  return "";
};

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Login sahifasiga kirganida eski tokenni o'chirish
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("student_token");
    localStorage.removeItem("role");
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://najot-edu.softwareengineer.uz/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = findToken(data);
        if (!token) {
          setError("Token topilmadi. Iltimos, qayta urinib ko'ring!");
          return;
        }
        localStorage.setItem("token", token);
        localStorage.setItem("student_token", token); // for Next.js mock compatibility if needed
        
        // Muvaffaqiyatli xabarni ko'rsatish
        setSuccessMessage("Siz muvaffaqiyatli kirdingiz!");
        
        // Role ni aniqlash (Token payload yoki API javobidan)
        let userRole = data.role || (data.user && data.user.role) || data.roleName;
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userRole =
            userRole ||
            payload.role ||
            payload.user_role ||
            payload.roleName ||
            payload.type ||
            (payload.roles && payload.roles[0]);
          if (userRole) {
            localStorage.setItem("role", userRole);
          }
        } catch (e) {
          console.error("Tokenni o'qishda xatolik:", e);
        }
        
        setTimeout(() => {
          const roleStr = String(userRole || "").toLowerCase();
          // O'quvchi roliga tekshirish
          if (
            roleStr.includes("student") ||
            roleStr.includes("pupil") ||
            roleStr.includes("oquvchi") ||
            roleStr === "user"
          ) {
            router.push("/student/home");
          }
          // O'qituvchi yoki Admin roliga tekshirish
          else if (
            roleStr.includes("admin") ||
            roleStr.includes("teacher") ||
            roleStr.includes("tutor") ||
            roleStr.includes("super")
          ) {
            router.push("/dashboard");
          }
          // Agar role topilmasa, default o'qituvchi paneli (yoki avvalgi holat)
          else {
            router.push("/dashboard");
          }
        }, 1200);
      } else {
        setError(data.message || "Telefon yoki parol noto'g'ri!");
      }
    } catch (error) {
      setError("Server bilan bog'lanishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessMessage("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <div className="hidden md:flex md:w-[700px] bg-blue-900 items-center justify-center p-[30px]">
        <Image
          src="/assets/study.svg"
          alt="study"
          width={600}
          height={600}
          className="max-w-full h-auto object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-[20px] md:p-12 bg-white">
        <div className="max-w-[450px] w-full text-center space-y-6">
          <h1 className="text-[16px] sm:text-[18px] sm:m-auto font-[500] w-[400px] m-auto mb-[10px]">
            MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI
            UNIVERSITETI
          </h1>

          <div className="flex justify-center">
            <Image
              src="/assets/tatu.png"
              alt="tatu"
              width={100}
              height={100}
              className="w-[80px] md:w-[100px] h-auto"
            />
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
              placeholder="998XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[50px] p-[15px] border border-gray-300 rounded-[10px] outline-none"
            />
          </div>

          <div className="flex flex-col gap-[5px] relative">
            <label className="font-[500] text-gray-700">Parol</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="XXXXXXXXXX"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] px-[15px] pr-[45px] border border-gray-300 rounded-[10px] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-[15px] top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rish"}
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              />
            </button>
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
              style={{ width: "100%", height: "50px" }}
            >
              {loading ? "Yuklanmoqda..." : "Kirish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Muvaffaqiyatli kirish xabari */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
