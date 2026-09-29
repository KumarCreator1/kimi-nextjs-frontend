// EnrolledClasses.js
// Displays the list of classes a user is enrolled in.
// Ownership logic (`isOwner`) is computed here client-side per backend handoff spec.

"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

const accentColors = ["clay", "sage", "ochre"];

function getAccent(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return accentColors[Math.abs(hash) % accentColors.length];
}

/**
 * @param {{
 *   classes: Array<{
 *     classId: string,
 *     className: string,
 *     role: "admin" | "member",
 *     classCreatorId: string,
 *   }>,
 *   currentUserId: string,
 * }} props
 */
export default function EnrolledClasses({ classes, currentUserId }) {
  if (classes.length === 0) {
    return (
      <div
        className="flex flex-col items-center text-center py-16 px-8 border border-dashed rounded-xl"
        style={{
          borderColor: "var(--border)",
          color: "var(--muted-foreground)",
        }}
      >
        <BookOpen
          size={32}
          style={{ opacity: 0.35, marginBottom: "12px" }}
        />
        <p className="m-0" style={{ fontSize: "14px" }}>
          You haven&apos;t joined any classes yet.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="space-y-3"
      style={{ listStyle: "none", padding: 0, margin: 0 }}
      aria-label="Enrolled classes"
    >
      {classes.map((cls) => {
        // Client-side ownership check — zero extra server work.
        const isOwner = cls.classCreatorId === currentUserId;
        const accent = getAccent(cls.classId);

        // Role pill: lowercase "admin" → display "Admin" etc.
        const roleLabel = cls.role === "admin" ? "Admin" : "Member";

        return (
          <li key={cls.classId}>
            <Link
              href={`/class/${cls.classId}`}
              className="flex items-center gap-4 p-4 rounded-xl border transition-all group"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
                textDecoration: "none",
                color: "inherit",
              }}
              id={`class-${cls.classId}`}
            >
              {/* Color accent dot matching the class card palette */}
              <span
                className={`${accent} flex-shrink-0`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  display: "inline-block",
                }}
                aria-hidden="true"
              />

              {/* Class name */}
              <span
                className="flex-1 font-medium truncate"
                style={{ fontSize: "14px" }}
              >
                {cls.className}
              </span>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Owner badge — only when classCreatorId === currentUserId */}
                {isOwner && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      background: "var(--ochre)",
                      color: "var(--ochre-dark)",
                    }}
                    aria-label="You created this class"
                  >
                    Owner
                  </span>
                )}

                {/* Role pill — "Admin" or "Member" */}
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={
                    cls.role === "admin"
                      ? { background: "#ead6ca", color: "var(--primary)" }
                      : { background: "var(--sage)", color: "var(--sage-dark)" }
                  }
                >
                  {roleLabel}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
