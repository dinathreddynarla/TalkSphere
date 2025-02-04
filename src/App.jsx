import * as React from "react";
import {Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard"; 
import Protected from "./Components/Protected";
import Room from './Components/Room'

const App = () => {
    return (

            <Routes>
                <Route path="/"  element={<LandingPage />} />
                <Route path="/dashboard/*" element={
                   <Protected> <Dashboard /> </Protected>
                   }/>
                <Route path="/room/:roomID" element={<Room />} />
            </Routes>

        
            
    );
};

export default App;
