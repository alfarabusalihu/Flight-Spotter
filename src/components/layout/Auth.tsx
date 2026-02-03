"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

export default function Auth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) return null;

    if (user) {
        return (
            <div className="flex items-center gap-2 bg-foreground/5 backdrop-blur-md border border-foreground/10 p-1 pr-3 rounded-full shadow-sm transition-all hover:bg-foreground/10">
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-full border border-foreground/10"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-dark-cyan flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                    </div>
                )}
                <span className="text-foreground text-sm font-medium hidden sm:block font-sans">
                    {user.displayName?.split(" ")[0]}
                </span>
                <button
                    onClick={handleSignOut}
                    className="p-1 hover:bg-red-500/10 rounded-full transition-colors group ml-1"
                    title="Sign Out"
                >
                    <LogOut className="w-4 h-4 text-foreground/40 group-hover:text-red-500 transition-colors" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleSignIn}
            className="flex items-center gap-2 px-6 py-2 bg-dark-cyan hover:bg-dark-cyan-light text-white rounded-full transition-all font-semibold text-sm shadow-md shadow-dark-cyan/20 font-sans"
        >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
        </button>
    );
}
