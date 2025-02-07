import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously ,signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Cookies from "js-cookie";
import { createUser, getUser } from "./userService";
// Login with email/password
export const loginWithEmailPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Extract the user from the response
        const token = await user.getIdToken()
        console.log(token);
        
        getUser(token)
        // Set cookie with 1 hour expiration
        const sessionData = { uid: user.uid, token: token };
        Cookies.set("session", JSON.stringify(sessionData), { expires: 1 / 24 });
    } catch (error) {
        console.error("Login failed:", error.message);
        throw error;
    }
};

// Register with email/password
export const signupWithEmailPassword = async (name,email, password) => {
    console.log(name,email,password);
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Extract the user from the response
        const token = await user.getIdToken()

       await createUser(token,user.uid,email,name)
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

        const token = await user.getIdToken()
        // Check if user exists in the database
        const userInfo = await getUser(token, user.uid);

        if (userInfo.error && userInfo.status === 404) {
            console.log("User not found, creating new user...");
            await createUser(token, user.uid, user.email, user.displayName);
        }
        // Set cookie with 1 hour expiration
        const sessionData = { uid: user.uid, token: token };
        Cookies.set("session", JSON.stringify(sessionData), { expires: 1 / 24 });
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
        const token = await user.getIdToken()

         // Set cookie with 1 hour expiration
         const sessionData = { uid: user.uid, token: token };
         Cookies.set("session", JSON.stringify(sessionData), { expires: 1 / 24 });
    } catch (error) {
        console.error("Guest login failed:", error.message);
        throw error;
    }
};

// Logout function
export const logout = async () => {
    try {
        await signOut(auth);
        // Clear session from Cookies
        Cookies.remove("session");
    } catch (error) {
        console.error("Logout failed:", error.message);
        throw error;
    }
};
