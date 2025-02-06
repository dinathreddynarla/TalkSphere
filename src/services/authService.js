import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously ,signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { createUser, getUser } from "./userService";
// Login with email/password
export const loginWithEmailPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Extract the user from the response
        const token = await user.getIdToken()
        console.log(token);
        
        getUser(token)
        // Store the user UID in localStorage
        localStorage.setItem("session", JSON.stringify({ uid: user.uid , token , email : user.email }));
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
        localStorage.setItem("session", JSON.stringify({ uid: user.uid , token , email : user.email }));
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

        // Store the user UID in localStorage
        localStorage.setItem("session", JSON.stringify({ uid: user.uid , token }));
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
