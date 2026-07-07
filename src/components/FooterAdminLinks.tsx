"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";

interface FooterAdminLinksProps {
  isLoggedIn?: boolean;
}

export default function FooterAdminLinks({ isLoggedIn = false }: FooterAdminLinksProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setLoggedIn(Boolean(d.authenticated));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <>
      <div className="flex items-center gap-3 shrink-0">
        {loggedIn ? (
          <>
            <Link
              href="/admin"
              className="text-sm px-4 py-2 rounded-full bg-orange text-white font-medium hover:bg-orange-light transition"
            >
              관리자 페이지
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-full border border-white/30 text-gray-300 hover:bg-white/10 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="text-sm px-4 py-2 rounded-full border border-white/30 text-gray-300 hover:bg-white/10 transition"
          >
            로그인
          </button>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
}
