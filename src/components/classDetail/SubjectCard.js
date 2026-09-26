"use client";

import Link from "next/link";
import { Book, FileText, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { subjectApi } from "@/lib/api";
import EditSubjectModal from "./EditSubjectModal";

export default function SubjectCard({ subject, classId, role, onRefresh }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault(); // prevent link navigation
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete ${subject.subjectName}?`)) return;
    
    setIsDeleting(true);
    try {
      await subjectApi.deleteSubject(classId, subject.id);
      if (onRefresh) onRefresh();
    } catch (error) {
      alert(error.message || "Failed to delete subject");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link
        href={`/class/${classId}/subject/${subject.id}`}
        className="subject-card group !min-h-0 !p-6 hover:border-[var(--primary)] transition-colors bg-[var(--card)] relative block"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 pr-8">
            <h4 className="text-xl font-serif text-[var(--primary)] group-hover:text-[var(--accent-hover)] transition-colors">
              {subject.subjectName}
            </h4>
            <p className="text-sm text-[var(--muted-foreground)]">
              {subject.description || 'No description provided'}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {role === "admin" ? (
              <div ref={menuRef} className="relative z-10">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="p-1 rounded-md hover:bg-black/5 text-[var(--muted-foreground)] transition-colors"
                  disabled={isDeleting}
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-1 overflow-hidden z-20">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setIsEditModalOpen(true); }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--muted)] flex items-center gap-2 transition-colors"
                    >
                      <Edit2 size={14} /> Edit Subject
                    </button>
                    <button 
                      onClick={(e) => { setIsMenuOpen(false); handleDelete(e); }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="subject-illustration !h-12 !w-12 bg-[var(--sage)] rounded-lg text-[var(--primary)] opacity-70">
                <Book size={24} />
              </div>
            )}
          </div>
        </div>
        
        {role === "admin" && (
          <div className="subject-illustration !h-10 !w-10 bg-[var(--sage)] rounded-lg text-[var(--primary)] opacity-70 mt-2">
            <Book size={20} />
          </div>
        )}

        <footer className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1.5">
            <FileText size={14} /> {subject.documentCount || 0} Documents
          </span>
          <span className="text-[var(--primary)] font-medium">
            View →
          </span>
        </footer>
      </Link>

      <EditSubjectModal 
        classId={classId}
        subject={subject}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onRefresh}
      />
    </>
  );
}
