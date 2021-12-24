// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Component imports
import Navbar from "./components/Navbar";
// Page imports
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Error from "./pages/Error";

function App() {
    return (
        <Router>
            <main className='min-h-screen bg-background text-white'>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
