"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell } from "lucide-react";

export default function DashboardHeader() {
  const { user } = useAuth();

  // Create a formatter for the current date
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date().toLocaleDateString("en-US", dateOptions);

  return (
    <div className="intro-row">
      <div>
        <p className="eyebrow">{today}</p>
        <h1>Good morning, {user?.firstName || "User"}.</h1>
        <p className="lede">A quiet place for everything your classes need.</p>
      </div>
      <button className="button button-dark">
        <Bell size={16} /> <span>1 pending request</span>
      </button>
    </div>
  );
}
