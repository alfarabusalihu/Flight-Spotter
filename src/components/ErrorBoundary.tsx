"use client";

import { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="glass-card max-w-md w-full p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-display font-bold text-foreground">Something went wrong</h2>
                        <p className="text-silver text-sm leading-relaxed">
                            {this.state.error?.message || "An unexpected error occurred. Please try again or go back home."}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full py-3 bg-dark-cyan text-white rounded-xl font-bold hover:bg-dark-cyan-light transition-all shadow-lg shadow-dark-cyan/20"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="w-full py-3 bg-silver/10 text-foreground rounded-xl font-bold hover:bg-silver/20 transition-all font-sans"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
