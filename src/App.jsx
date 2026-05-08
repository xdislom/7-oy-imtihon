import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from "./components/login"
import Main from "./components/Main"

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/main" element={<Main />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
