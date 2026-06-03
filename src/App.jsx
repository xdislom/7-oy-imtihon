import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

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
import GroupHomeworkResults from "./pages/GroupHomeworkResults"
import HomeworkCheck from "./pages/HomeworkCheck"

// Token yo'q bo'lsa Login ga qaytaradi
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token")
    if (!token || token === "undefined" || token === "null") {
        return <Navigate to="/" replace />
    }
    return children
}

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/teachers" element={<PrivateRoute><Teachers /></PrivateRoute>} />
                <Route path="/classes" element={<PrivateRoute><Classes /></PrivateRoute>} />
                <Route path="/dashboard/groups/:groupId/homework/create" element={<PrivateRoute><GroupHomeworkCreate /></PrivateRoute>} />
                <Route path="/classes/groups/:groupId/homework/create" element={<PrivateRoute><GroupHomeworkCreate /></PrivateRoute>} />
                <Route path="/dashboard/groups/:groupId/exams/create" element={<PrivateRoute><GroupExamCreate /></PrivateRoute>} />
                <Route path="/classes/groups/:groupId/exams/create" element={<PrivateRoute><GroupExamCreate /></PrivateRoute>} />
                <Route path="/dashboard/groups/:groupId/exams/:examId" element={<PrivateRoute><GroupExamDetail /></PrivateRoute>} />
                <Route path="/classes/groups/:groupId/exams/:examId" element={<PrivateRoute><GroupExamDetail /></PrivateRoute>} />
                <Route path="/dashboard/groups/:groupId/homework/:homeworkId/results" element={<PrivateRoute><GroupHomeworkResults /></PrivateRoute>} />
                <Route path="/classes/groups/:groupId/homework/:homeworkId/results" element={<PrivateRoute><GroupHomeworkResults /></PrivateRoute>} />
                <Route path="/dashboard/groups/:groupId/homework/:homeworkId/results/:studentId" element={<PrivateRoute><HomeworkCheck /></PrivateRoute>} />
                <Route path="/classes/groups/:groupId/homework/:homeworkId/results/:studentId" element={<PrivateRoute><HomeworkCheck /></PrivateRoute>} />
                <Route path="/dashboard/groups/:groupId" element={<PrivateRoute><GroupDetail /></PrivateRoute>} />
                <Route path="/classes/groups/:groupId" element={<PrivateRoute><GroupDetail /></PrivateRoute>} />
                <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
                <Route path="/gifts" element={<PrivateRoute><Gifts /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

