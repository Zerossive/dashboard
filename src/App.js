// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Component imports
import Navbar from "./components/Navbar";
// Page imports
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Error from "./pages/Error";

function App() {
    // TESTING
    const backgroundImageUrl = "";
    const backgroundBlur = 10;
    const backgroundBrightness = 70;

    return (
        <Router>
            <main
                className='min-h-screen bg-background text-white bg-cover bg-fixed'
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                }}
            >
                {/* Background Blur */}
                <div
                    className='w-full h-full min-h-screen'
                    style={{
                        WebkitBackdropFilter: `blur(${
                            backgroundImageUrl && backgroundBlur
                        }px) brightness(${
                            backgroundImageUrl && backgroundBrightness
                        }%)`,
                        backdropFilter: `blur(${
                            backgroundImageUrl && backgroundBlur
                        }px) brightness(${
                            backgroundImageUrl && backgroundBrightness
                        }%)`,
                    }}
                >
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/settings' element={<Settings />} />
                        <Route path='*' element={<Error />} />
                    </Routes>
                </div>
            </main>
        </Router>
    );
}

export default App;
