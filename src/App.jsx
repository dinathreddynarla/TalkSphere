import * as React from "react";
import {Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage/LandingPage";
import Dashboard from "./Components/Dashboard"; 
import Protected from "./Components/Protected";
import Room from './Components/Room'
import NotFound from "./Components/NotFound";

// export const baseUrl = "http://localhost:5000"
export const baseUrl = "https://talksphere-nyay.onrender.com"

const App = () => {
    return (

        <div style={{ height: "100%", width: "100%", minHeight:"100%", minWidth:"100%", display: "flex" , overflow:"hidden"  }}>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard/*" element={
                <Protected>
                    <Dashboard />
                </Protected>
            }/>
            <Route path="/room/:roomID" element={<Room />} />
            <Route path="*" element={<NotFound />} />
        </Routes>    
    </div>
    );
};

export default App;
