import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { auth } from "../src/firebase";


export const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

export const googleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
}

export const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
} 

export const logOut = () => {
    localStorage.removeItem("accessToken");
    return signOut(auth);
}