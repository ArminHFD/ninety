import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAX3Sd56Ahs3ygqPOLdotYt0SRmA85QD9o",
    authDomain: "ninety-94c8e.firebaseapp.com",
    projectId: "ninety-94c8e",
    storageBucket: "ninety-94c8e.firebasestorage.app",
    messagingSenderId: "850184897639",
    appId: "1:850184897639:web:6677b0abf16733eb2f00c2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export async function signInUser() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}