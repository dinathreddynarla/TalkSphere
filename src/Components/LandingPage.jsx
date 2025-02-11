import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { loginWithEmailPassword, signupWithEmailPassword, loginWithGoogle, guestLogin, passwordReset } from "../services/authService";
import "../Styles/LandingPage.css"; 
import Logo from "../assets/logo.png"; 
import Cookies from "js-cookie";

const LandingPage = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [roomID , setRoomID] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate(); 

    const changeIsLogin = () => {
        setIsLoginForm((prev) => !prev);
    };
    
    //To check user session
    useEffect(() => {
         const cookie = Cookies.get("session")
        const session = cookie ? JSON.parse(cookie) : null ;
        console.log(session);
        
        const roomSession = localStorage.getItem("roomID")

        if(roomSession){
            setRoomID(roomSession)
        }
        if (session) {      
            navigate("/dashboard");
        }
      }, [navigate]);

    //handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginWithEmailPassword(email, password);
            console.log("Login successful!");
            if(roomID){
                navigate(`/room/${roomID}`) // Redirect to Room , if user comes from RoomId
            }else {
                navigate("/dashboard"); // Redirect to dashboard after successful login
            }
            
        } catch (error) {
            alert("Login failed! Please check your credentials.");
        }
    };

    //handle signup
    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            console.log(name,email);
            
            await signupWithEmailPassword(name,email, password);
            console.log("Signup successful!");
            setIsLoginForm(true); // Switch to login form after successful signup
        } catch (error) {
            alert("Signup failed! Please check your details.");
        }
    };

    //handle google login
    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            console.log("Google login successful!");
            if(roomID){
                navigate(`/room/${roomID}`)
            }else {
                navigate("/dashboard"); // Redirect to dashboard after successful login
            }
            
        } catch (error) {
            alert("Google login failed!");
        }
    };

    //handle guest login
    const handleGuestLogin = async () => {
        try {
            await guestLogin();
            console.log("Guest login successful!");
            if(roomID){
                navigate(`/room/${roomID}`)
            }else {
                navigate("/dashboard"); // Redirect to dashboard after successful login
            }
        } catch (error) {
            alert("Guest login failed!");
        }
    };

    const handleForgotPassword = async (e)=>{
        e.preventDefault();
        try{
            await passwordReset(email)
            alert(`Password reset email sent to ${email}`)    
        }
        catch (err){
            alert(err.message)
            
        }
    }

    return (
        <div className="landing-page">
            <header className="header">
                <h1 className="brand-name">TalkSphere</h1>
            </header>

            <main className="main-section">
                <div className="logo-section">
                    <img src={Logo} alt="Logo" className="logo" />
                </div>

                <div className="form-section">
                    {isLoginForm ? (
                        <div className="login-form">
                            <h2 className="form-title">Login</h2>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={handleLogin} className="submit-button">Submit</button>
                            <button onClick={handleGoogleLogin} className="submit-button">Login with Google</button>
                            <button onClick={handleForgotPassword} className="submit-button">Forgot Password</button>
                            <button onClick={handleGuestLogin} className="submit-button">Guest Login</button>
                            <p className="signup-text">
                                Don't have an account? <button onClick={changeIsLogin}>Sign Up</button>
                            </p>
                        </div>
                    ) : (
                        <div className="signup-form">
                            <h2 className="form-title">Sign Up</h2>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="input-field"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button onClick={handleSignup} className="submit-button">Submit</button>


                            <p className="signup-text">
                                Already have an account? <button onClick={changeIsLogin}>Login</button>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
