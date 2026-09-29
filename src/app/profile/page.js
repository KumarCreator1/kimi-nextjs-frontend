"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { profileApi } from "@/lib/api";
import TopBar from "@/components/TopBar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EnrolledClasses from "@/components/profile/EnrolledClasses";
import { LogOut, BookOpen } from "lucide-react";

export default function ProfilePage() {
  // `user` from context is only used as the auth guard / redirect trigger.
  // Profile data (including enrolledClasses) is fetched independently below.
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Runs ONCE when /profile mounts.
  // Independent of AuthContext — does not share or write to it.
  useEffect(() => {
    if (authLoading) return; // wait for the boot-time /me to resolve first
    if (!user) return;       // AuthContext's second useEffect will redirect to /login

    async function fetchProfile() {
      try {
        const res = await profileApi.getProfile();
        setProfileData(res.data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [authLoading, user]); // re-fetch only if auth state flips (e.g. token refresh)

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    // AuthContext.logout() redirects to /login — nothing else needed here.
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (authLoading || isLoading) {
    return (
      <div className="app-shell flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
          />
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error || !profileData) {
    return (
      <div className="app-shell flex flex-col">
        <TopBar />
        <main className="flex-1 main-content w-full">
          <div className="error-banner max-w-md mx-auto mt-16">{error || "Something went wrong"}</div>
        </main>
      </div>
    );
  }

  const { user: profileUser, enrolledClasses } = profileData;

  // ── Page ─────────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell flex flex-col">
      <TopBar />

      <main className="flex-1 main-content w-full" id="profile-main">
        <section className="page-section" style={{ maxWidth: 680 }}>

          {/* 1. Identity card */}
          <ProfileHeader user={profileUser} />

          {/* 2. Enrolled classes */}
          <div className="section-heading" style={{ marginTop: 48, marginBottom: 16 }}>
            <h2 className="flex items-center gap-2 m-0">
              <BookOpen size={20} style={{ color: "var(--muted-foreground)" }} />
              Classes
            </h2>
            <span
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {enrolledClasses.length}{" "}
              {enrolledClasses.length === 1 ? "class" : "classes"}
            </span>
          </div>

          <EnrolledClasses
            classes={enrolledClasses}
            currentUserId={profileUser.id}
          />

          {/* 3. Sign-out — kept as a single purposeful action, not buried in a list */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <button
              id="profile-sign-out"
              className="button button-light"
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                color: "var(--error)",
                borderColor: "var(--error-border)",
              }}
            >
              <LogOut size={15} />
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>

        </section>
      </main>
    </div>
  );
}
