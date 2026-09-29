"use client";

import Link from "next/link";
import { BookOpen, Bell, Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TopBar() {
  const { user } = useAuth();

  // Compute initials client-side per backend handoff spec.
  // lastName is nullable — filter(Boolean) drops it gracefully.
  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div className="topbar">
      <Link href="/dashboard" className="brand flex-shrink-0">
        <div className="brand-mark">
          <BookOpen size={16} />
        </div>
        KIMI NO
      </Link>

      <div className="crumbs">{/* Breadcrumbs can go here */}</div>

      <div className="top-actions">
        <div className="searchbox">
          <Search />
          <input type="text" placeholder="Search classes, subjects, notes..." />
        </div>

        <button className="icon-button relative">
          <span className="notification-dot"></span>
          <Bell />
        </button>

        <Link
          href="/profile"
          className="avatar hover:opacity-80 transition-opacity ml-2"
          aria-label="Go to profile"
        >
          {initials || <User size={14} />}
        </Link>
      </div>

      <div className="mobile-menu">
        <button className="icon-button">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
