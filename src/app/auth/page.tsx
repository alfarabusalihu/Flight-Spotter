
"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { LogIn, Plane } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push("/");
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/5 rounded-[2rem] p-10 shadow-2xl relative z-10 overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-dark-cyan/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-dark-cyan-light/20 blur-3xl rounded-full" />

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-dark-cyan rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-dark-cyan/20">
                        <Plane className="w-8 h-8 rotate-45" />
                    </div>

                    <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                        Welcome Back
                    </h1>
                    <p className="text-foreground/60 mb-10 text-sm leading-relaxed">
                        Sign in to access real-time flight trends, save your favorite routes, and unlock personalized travel insights.
                    </p>

                    <button
                        onClick={handleSignIn}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-foreground/5 text-foreground hover:bg-foreground/5 dark:hover:bg-foreground/10 border border-foreground/10 rounded-2xl transition-all font-semibold group"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <p className="mt-8 text-xs text-foreground/40">
                        By continuing, you agree to our Terms of Service <br /> and Privacy Policy.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
