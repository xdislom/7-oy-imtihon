import React, { useState, useEffect, useRef } from 'react'

const API_URL = "https://najot-edu.softwareengineer.uz/api/v1"

export default function VideoPlayer({ url, token, fileId, rawVideoUrl }) {
    const [urlsToTry, setUrlsToTry] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [error, setError] = useState("")
    const [blobUrl, setBlobUrl] = useState("")
    const blobUrlRef = useRef(null)

    useEffect(() => {
        let tryUrls = []
        if (url && url.startsWith("http")) tryUrls.push(url)
        const authToken = (token || '').replace(/^Bearer\s+/i, '').trim()

        let fileName = "";
        if (rawVideoUrl) {
            fileName = rawVideoUrl.split("/").pop();
            const d = "https://najot-edu.softwareengineer.uz";
            const normalizedRaw = rawVideoUrl.replace(/^\/+/, "");
            const withoutPublic = normalizedRaw.replace(/^(public\/+)+/, "");

            if (rawVideoUrl.startsWith("http")) {
                tryUrls.push(rawVideoUrl);
            }
            if (rawVideoUrl.startsWith("/public/")) {
                tryUrls.push(`${d}/${withoutPublic}`);
                tryUrls.push(`${d}${rawVideoUrl.replace(/^\/public/, "")}`);
            }
            if (rawVideoUrl.startsWith("/")) {
                tryUrls.push(`${d}${rawVideoUrl}`);
            } else if (!rawVideoUrl.startsWith("http")) {
                tryUrls.push(`${d}/${normalizedRaw}`);
            }
            if (withoutPublic && withoutPublic !== normalizedRaw) {
                tryUrls.push(`${d}/${withoutPublic}`);
            }

            tryUrls.push(`${d}/files/files/${fileName}`);
            tryUrls.push(`${d}/assets/${fileName}`);
            tryUrls.push(`${d}/uploads/${fileName}`);
            tryUrls.push(`${d}/api/v1/uploads/${fileName}`);
            tryUrls.push(`${d}/files/${fileName}`);
            tryUrls.push(`${d}/api/v1/files/${fileName}`);
        }

        if (fileId) {
            tryUrls.push(`${API_URL}/files/download/${fileId}`)
            tryUrls.push(`${API_URL}/files/${fileId}`)
            if (authToken) {
                tryUrls.push(`${API_URL}/files/download/${fileId}?token=${encodeURIComponent(authToken)}`)
                tryUrls.push(`${API_URL}/files/${fileId}?token=${encodeURIComponent(authToken)}`)
            }
        }

        const uniqueUrls = [...new Set(tryUrls)]
        setUrlsToTry(uniqueUrls)
        setCurrentIndex(0)
        setError("")
        setBlobUrl("")
    }, [url, fileId, rawVideoUrl])

    useEffect(() => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
            blobUrlRef.current = null
        }

        const currentUrl = urlsToTry[currentIndex]
        if (!currentUrl) {
            setBlobUrl("")
            return
        }

        const shouldFetchWithAuth = token && currentUrl.startsWith(API_URL)
        if (!shouldFetchWithAuth) {
            setBlobUrl("")
            return
        }

        const controller = new AbortController()
        const authToken = (token || '').replace(/^Bearer\s+/i, '').trim()
        fetch(currentUrl, {
            headers: { Authorization: `Bearer ${authToken}` },
            signal: controller.signal
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Video fetch failed ${res.status}`)
                return res.blob()
            })
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob)
                blobUrlRef.current = objectUrl
                setBlobUrl(objectUrl)
            })
            .catch((err) => {
                if (err.name === 'AbortError') return
                if (currentIndex < urlsToTry.length - 1) {
                    setCurrentIndex((prev) => prev + 1)
                } else {
                    setError("Video topilmadi yoki serverdan kelmayapti.")
                }
            })

        return () => {
            controller.abort()
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current)
                blobUrlRef.current = null
            }
        }
    }, [urlsToTry, currentIndex, token])

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 text-center w-full h-full px-6">
                <i className="fa-regular fa-circle-play text-white text-6xl opacity-30"></i>
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        )
    }

    if (urlsToTry.length === 0) return null;

    const currentUrl = urlsToTry[currentIndex];
    const isAuthUrl = token && currentUrl && currentUrl.startsWith(API_URL);
    const videoSrc = isAuthUrl ? blobUrl : currentUrl;

    return (
        <div className="w-full h-full relative">
            {isAuthUrl && !blobUrl ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-white gap-3">
                    <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
                    <p className="text-sm text-gray-300">Video yuklanmoqda...</p>
                </div>
            ) : (
                <video
                    key={videoSrc || currentUrl}
                    src={videoSrc}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    onError={() => {
                        if (currentIndex < urlsToTry.length - 1) {
                            setCurrentIndex(prev => prev + 1);
                        } else {
                            setError("Video topilmadi yoki serverdan kelmayapti.");
                        }
                    }}
                >
                    Brauzeringiz video formatini qo'llab-quvvatlamaydi.
                </video>
            )}
        </div>
    )
}
