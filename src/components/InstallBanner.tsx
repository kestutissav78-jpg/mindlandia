"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);
}

const DISMISSED_KEY = "ml-install-dismissed";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const iosDevice = isIos();

    if (iosDevice) {
      // iOS Safari — no beforeinstallprompt, show manual instructions after delay
      const t = setTimeout(() => {
        setIos(true);
        setVisible(true);
      }, 3000);
      return () => clearTimeout(t);
    }

    // Android Chrome / other browsers
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setVisible(false));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl shadow-black/60 fade-up">
      {/* close */}
      <button onClick={dismiss} className="absolute right-3 top-3 text-zinc-500 hover:text-white text-lg leading-none">✕</button>

      {/* header */}
      <div className="flex items-center gap-3">
        <Image src="/icon-192.png" alt="MindLandia" width={44} height={44} className="rounded-xl" />
        <div>
          <p className="font-black text-white">MindLandia</p>
          <p className="text-xs text-zinc-500">Add to Home Screen</p>
        </div>
      </div>

      {ios ? (
        /* iOS instructions */
        <div className="mt-4 rounded-xl border border-zinc-800 bg-black p-3 space-y-2">
          <p className="text-xs font-semibold text-zinc-300">Install on iPhone / iPad:</p>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-base">1.</span>
            <span>Tap the <strong className="text-white">Share</strong> button</span>
            <span className="ml-auto text-lg">⎙</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-base">2.</span>
            <span>Choose <strong className="text-white">&quot;Add to Home Screen&quot;</strong></span>
            <span className="ml-auto text-base">＋</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-base">3.</span>
            <span>Tap <strong className="text-white">Add</strong> — done!</span>
            <span className="ml-auto text-base">✓</span>
          </div>
        </div>
      ) : (
        /* Android / Chrome one-tap install */
        <button
          onClick={handleInstall}
          className="btn-primary mt-4 w-full rounded-xl py-3 text-sm font-black text-black"
        >
          Install App
        </button>
      )}

      <button onClick={dismiss} className="mt-3 w-full text-center text-xs text-zinc-600 hover:text-zinc-400">
        Not now
      </button>
    </div>
  );
}
