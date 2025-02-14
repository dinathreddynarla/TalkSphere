import * as React from "react";
import {Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard"; 
import Protected from "./Components/Protected";
import Room from './Components/Room'
import NotFound from "./Components/NotFound";

// export const baseUrl = "http://localhost:5000"
export const baseUrl = "https://talksphere-nyay.onrender.com"

const App = () => {
    return (

            <Routes>
                <Route path="/"  element={<LandingPage />} />
                <Route path="/dashboard/*" element={
                   <Protected> <Dashboard /> </Protected>
                   }/>
                <Route path="/room/:roomID" element={<Room />} />
                 {/* Catch-all route for any undefined path */}
                <Route path="*" element={<NotFound />} />
            </Routes>    
    );
};

export default App;
