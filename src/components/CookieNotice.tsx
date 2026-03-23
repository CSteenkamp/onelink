"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_acknowledged")) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("cookie_acknowledged", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-lg mx-auto bg-gray-900 border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-lg">
        <p className="text-gray-300 text-sm flex-1">
          We use a single cookie to keep you logged in. No tracking.{" "}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
            Learn more
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg transition-colors flex-shrink-0"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
