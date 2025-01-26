import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously ,signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Login with email/password
export const loginWithEmailPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Extract the user from the response

        // Store the user UID in localStorage
        localStorage.setItem("session", JSON.stringify({ uid: user.uid }));
    } catch (error) {
        console.error("Login failed:", error.message);
        throw error;
    }
};

// Register with email/password
export const signupWithEmailPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Extract the user from the response

        // Store the user UID in localStorage
        localStorage.setItem("session", JSON.stringify({ uid: user.uid }));
    } catch (error) {
        console.error("Signup failed:", error.message);
        throw error;
    }
};

// Google Sign-In (Popup)
export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user; // Extract the user from the result

        // Store the user UID in localStorage
        localStorage.setItem("session", JSON.stringify({ uid: user.uid }));
    } catch (error) {
        console.error("Google login failed:", error.message);
        throw error;
    }
};

// Guest Login (Anonymous)
export const guestLogin = async () => {
    try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user; // Extract the user from the response

        // Store the user UID in localStorage
        localStorage.setItem("session", JSON.stringify({ uid: user.uid }));
    } catch (error) {
        console.error("Guest login failed:", error.message);
        throw error;
    }
};

// Logout function
export const logout = async () => {
    try {
        await signOut(auth);
        // Clear session from localStorage
        localStorage.removeItem("session");
    } catch (error) {
        console.error("Logout failed:", error.message);
        throw error;
    }
};
