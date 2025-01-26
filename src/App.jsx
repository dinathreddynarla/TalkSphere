import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard"; // Create this component
import Protected from "./Components/Protected";

const App = () => {
    return (
        
            <Routes>
                <Route path="/"  element={<LandingPage />} />
                <Route path="/dashboard/*" element={
                   <Protected> <Dashboard /> </Protected>
                   }/>
            </Routes>
        
    );
};

export default App;
