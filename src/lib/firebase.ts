import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { useState, useEffect } from "react";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_apiKey,
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_appId,
};

// Check if environment variables are loaded
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.authDomain;

if (!isConfigValid && typeof window !== 'undefined') {
    console.warn("Firebase configuration is missing! Check your .env file and restart the dev server.");
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

// Custom hook for auth state
export function useAuth() {
    if (typeof window === 'undefined') {
        return { user: null, loading: true, isAuthenticated: false };
    }

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { onAuthStateChanged } = require('firebase/auth');
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading, isAuthenticated: !!user };
}
