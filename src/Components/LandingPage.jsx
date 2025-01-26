import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { loginWithEmailPassword, signupWithEmailPassword, loginWithGoogle, guestLogin } from "../services/authService";
import "../Styles/LandingPage.css"; // Import the CSS file
import Logo from "../assets/logo.png"; // Update with the correct path to your logo file

const LandingPage = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate(); // Hook to navigate programmatically

    const changeIsLogin = () => {
        setIsLoginForm((prev) => !prev);
    };
    useEffect(() => {
        const session = JSON.parse(localStorage.getItem("session"));
        if (session) {      
            navigate("/dashboard");
        }
      }, [navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginWithEmailPassword(email, password);
            console.log("Login successful!");
            navigate("/dashboard"); // Redirect to dashboard after successful login
        } catch (error) {
            alert("Login failed! Please check your credentials.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await signupWithEmailPassword(email, password);
            console.log("Signup successful!");
            setIsLoginForm(true); // Switch to login form after successful signup
        } catch (error) {
            alert("Signup failed! Please check your details.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            console.log("Google login successful!");
            navigate("/dashboard"); // Redirect to dashboard after Google login
        } catch (error) {
            alert("Google login failed!");
        }
    };

    const handleGuestLogin = async () => {
        try {
            await guestLogin();
            console.log("Guest login successful!");
            navigate("/dashboard"); // Redirect to dashboard after guest login
        } catch (error) {
            alert("Guest login failed!");
        }
    };

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
