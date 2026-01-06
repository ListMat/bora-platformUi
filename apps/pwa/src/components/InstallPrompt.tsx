'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Detect if the app was installed
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowInstallButton(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowInstallButton(false);
    };

    if (isInstalled || !showInstallButton) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl shadow-2xl p-6 mx-4 max-w-md backdrop-blur-lg border border-white/20">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">
                            Instalar App Bora
                        </h3>
                        <p className="text-white/80 text-sm mb-4">
                            Instale nosso aplicativo para acesso rápido e experiência offline
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 bg-white text-purple-600 font-semibold py-2.5 px-4 rounded-xl hover:bg-white/90 transition-all duration-200 active:scale-95"
                            >
                                Instalar
                            </button>
                            <button
                                onClick={() => setShowInstallButton(false)}
                                className="px-4 py-2.5 text-white/80 hover:text-white font-medium transition-colors"
                            >
                                Agora não
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
