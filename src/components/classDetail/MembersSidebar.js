"use client";

import { useState } from "react";
import { Plus, UserMinus } from "lucide-react";
import { classApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function MembersSidebar({ classId, members, role, onRefresh }) {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await classApi.addMember(classId, email);
      setEmail("");
      setIsAdding(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message || "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!confirm(`Are you sure you want to remove ${memberName}?`)) return;
    
    try {
      await classApi.removeMember(classId, memberId);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Failed to remove member");
    }
  };

  return (
    <div className="w-full lg:w-80 space-y-8">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif m-0">
            Members{" "}
            <span className="text-[var(--muted-foreground)] text-base font-sans">
              ({members.length})
            </span>
          </h3>
          {role === "admin" && (
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="button button-light !min-h-[32px] !px-3 text-xs"
            >
              <Plus size={14} /> Add
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAddMember} className="mb-6 space-y-3 p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
            <h4 className="text-sm font-medium">Add by Email</h4>
            <input 
              type="email" 
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] outline-none focus:border-[var(--primary)]"
              disabled={isLoading}
            />
            {error && <p className="text-xs text-[var(--error)]">{error}</p>}
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => { setIsAdding(false); setError(null); }}
                className="button button-light flex-1 !min-h-0 !py-1 text-xs"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="button button-dark flex-1 !min-h-0 !py-1 text-xs"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="font-medium text-sm text-[var(--ink)] truncate">
                  {member.firstName} {member.lastName}
                  {member.userId === user?.id && " (You)"}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">
                  {member.email}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-opacity-30 ${member.role === 'admin' ? 'bg-[var(--clay)] text-[var(--clay-dark)]' : 'bg-[var(--sage)] text-[var(--sage-dark)]'} text-[var(--ink)]`}
                >
                  {member.role}
                </span>
                
                {role === "admin" && member.userId !== user?.id && (
                  <button 
                    onClick={() => handleRemoveMember(member.userId, `${member.firstName} ${member.lastName}`)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--error)] hover:bg-white rounded p-1 transition-all"
                    title="Remove Member"
                  >
                    <UserMinus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
