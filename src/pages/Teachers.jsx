import Sidebar from "../components/Sidebar"

export default function Teachers() {
    return (
        <div className="max-w-[1600px] m-auto">
            <div className="flex">
                <Sidebar />
                <div className="w-full min-h-screen md:pl-[30px] p-[15px] md:p-8 bg-gray-100">
                    <h2 className="text-[28px] font-[600] mt-4">O'qituvchilar</h2>
                    <p className="text-gray-600 font-[500]">O'qituvchilar ro'yxati bu yerda ko'rsatiladi.</p>
                </div>
            </div>
        </div>
    )
}
