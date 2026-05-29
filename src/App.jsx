import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import Teachers from "./pages/Teachers"
import Classes from "./pages/Classes"
import GroupDetail from "./pages/GroupDetail"
import GroupHomeworkCreate from "./pages/GroupHomeworkCreate"
import GroupExamCreate from "./pages/GroupExamCreate"
import GroupExamDetail from "./pages/GroupExamDetail"
import Students from "./pages/Students"
import Gifts from "./pages/Gifts"
import Settings from "./pages/Settings"


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/dashboard/groups/:groupId/homework/create" element={<GroupHomeworkCreate />} />
                <Route path="/classes/groups/:groupId/homework/create" element={<GroupHomeworkCreate />} />
                <Route path="/dashboard/groups/:groupId/exams/create" element={<GroupExamCreate />} />
                <Route path="/classes/groups/:groupId/exams/create" element={<GroupExamCreate />} />
                <Route path="/dashboard/groups/:groupId/exams/:examId" element={<GroupExamDetail />} />
                <Route path="/classes/groups/:groupId/exams/:examId" element={<GroupExamDetail />} />
                <Route path="/dashboard/groups/:groupId" element={<GroupDetail />} />
                <Route path="/classes/groups/:groupId" element={<GroupDetail />} />
                <Route path="/students" element={<Students />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
