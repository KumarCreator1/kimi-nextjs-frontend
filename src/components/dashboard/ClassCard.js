"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Users, Trash2, Edit2, LogOut } from "lucide-react";
import { classApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import EditClassModal from "./EditClassModal";

const accents = ["clay", "sage", "ochre"];

const getAccent = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return accents[Math.abs(hash) % accents.length];
};

export default function ClassCard({ classData, index, onRefresh }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef(null);

  const accentColor = getAccent(classData.id);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (e) => {
    // Navigate only if the click wasn't on the menu button or inside the menu
    if (!menuRef.current?.contains(e.target)) {
      router.push(`/class/${classData.id}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${classData.className}?`))
      return;

    setIsDeleting(true);
    try {
      await classApi.deleteClass(classData.id);
      if (onRefresh) onRefresh();
    } catch (error) {
      alert(error.message || "Failed to delete class");
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm(`Are you sure you want to leave ${classData.className}?`))
      return;

    setIsDeleting(true);
    try {
      await classApi.removeMember(classData.id, user?.id);
      if (onRefresh) onRefresh();
    } catch (error) {
      alert(error.message || "Failed to leave class");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`class-card ${accentColor} relative cursor-pointer group`}
      >
        <div className="card-top relative">
          <span className="class-number">{index + 1}</span>

          <div ref={menuRef} className="relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 rounded-md hover:bg-black/10 transition-colors"
              disabled={isDeleting}
            >
              <MoreHorizontal size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-1 overflow-hidden z-20">
                {classData.isCreator ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--muted)] flex items-center gap-2 transition-colors"
                    >
                      <Edit2 size={14} /> Edit Class
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        handleDelete();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Class
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      handleLeave();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={14} /> Leave Class
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="class-copy">
          <p>{classData.className}</p>
          <h3>{classData.className}</h3>
          <span>{classData.description || "No description provided"}</span>
        </div>

        <div className="class-meta">
          <span>
            <Users size={14} /> {classData.members || 0} students
          </span>
        </div>

        <div className="card-footer">
          <span>{/* Teacher Name Placeholder */}</span>
        </div>
      </div>

      <EditClassModal
        classData={classData}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onRefresh}
      />
    </>
  );
}
