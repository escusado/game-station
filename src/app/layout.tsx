"use client";

import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const handle = (ev: { preventDefault: () => void }) => {
      ev.preventDefault(); // Prevent text selection
    };
    window.document.addEventListener("touchstart", handle, { passive: false });
    window.document.addEventListener("touchmove", handle, { passive: false });
    window.document.addEventListener("touchend", handle, { passive: false });
    window.document.addEventListener("touchcancel", handle, { passive: false });
    return () => {
      window.document.removeEventListener("touchstart", handle);
      window.document.removeEventListener("touchmove", handle);
      window.document.removeEventListener("touchend", handle);
      window.document.removeEventListener("touchcancel", handle);
    };
  }, []);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
