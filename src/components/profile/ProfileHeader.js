// ProfileHeader.js
// Renders the identity card at the top of the /profile page.
// All name + initials logic is done client-side (per backend handoff spec).

import { Mail } from "lucide-react";

/**
 * @param {{ user: { firstName: string, lastName: string|null, email: string } }} props
 */
export default function ProfileHeader({ user }) {
  // Full name: omit trailing space if lastName is null.
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  // Initials: "VK", "V", etc.
  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div className="profile-card" style={{ borderRadius: "var(--radius)" }}>
      {/* Avatar */}
      <div className="large-avatar" aria-hidden="true">
        {initials}
      </div>

      {/* Identity text */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h2 className="m-0 leading-tight">{fullName}</h2>
        <p
          className="flex items-center gap-2 m-0"
          style={{ color: "var(--muted-foreground)", fontSize: "13px" }}
        >
          <Mail size={13} />
          {user.email}
        </p>
      </div>
    </div>
  );
}
