"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setVisible(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || installed) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl shadow-black/60">
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 text-zinc-500 hover:text-white"
        aria-label="Close"
      >
        ✕
      </button>
      <div className="flex items-center gap-3">
        <Image src="/icon-192.png" alt="MindLandia" width={48} height={48} className="rounded-xl" />
        <div>
          <p className="font-bold text-white">MindLandia</p>
          <p className="text-sm text-zinc-400">Įdiegk kaip programą</p>
        </div>
      </div>
      <button
        onClick={handleInstall}
        className="mt-3 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-black hover:bg-emerald-400 active:scale-95 transition-transform"
      >
        Įdiegti
      </button>
    </div>
  );
}
