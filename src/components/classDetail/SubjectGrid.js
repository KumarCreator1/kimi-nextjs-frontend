"use client";

import { useState } from "react";
import SubjectCard from "./SubjectCard";
import CreateSubjectModal from "./CreateSubjectModal";
import { Plus } from "lucide-react";

export default function SubjectGrid({ classId, subjects, role, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="section-heading !mt-0">
        <h3 className="text-2xl font-serif">Subjects</h3>
        {role === "admin" && (
          <button onClick={() => setIsModalOpen(true)} className="button button-light">
            <Plus size={16} /> Add Subject
          </button>
        )}
      </div>

      {subjects.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center flex flex-col items-center">
          <h4 className="text-lg font-serif">No subjects yet</h4>
          <p className="text-[var(--muted-foreground)] mt-2 text-sm">Create the first subject to organize your notes.</p>
          {role === "admin" && (
            <button onClick={() => setIsModalOpen(true)} className="button button-dark mt-4">
              <Plus size={14} /> Create Subject
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((sub) => (
            <SubjectCard 
              key={sub.id} 
              subject={sub} 
              classId={classId} 
              role={role} 
              onRefresh={onRefresh} 
            />
          ))}
        </div>
      )}

      <CreateSubjectModal 
        classId={classId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={onRefresh} 
      />
    </div>
  );
}
