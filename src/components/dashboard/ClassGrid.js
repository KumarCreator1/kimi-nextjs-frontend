"use client";

import { useEffect, useState, useCallback } from "react";
import { classApi } from "@/lib/api";
import ClassCard from "./ClassCard";
import CreateClassModal from "./CreateClassModal";
import { ChevronRight, Plus, FolderOpen } from "lucide-react";

export default function ClassGrid() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await classApi.getUserClasses();
      setClasses(res.data?.classes || []);
    } catch (err) {
      setError(err.message || "Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleClassCreated = (newClass) => {
    // Optionally refetch entirely or just prepend the new class
    fetchClasses();
  };

  return (
    <>
      <div className="section-heading">
        <h2>Your classes</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="button button-light !min-h-0 !py-2 !px-3 text-sm"
          >
            <Plus size={16} /> Add Class
          </button>
          <button className="text-button">
            View all <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-[var(--error)] bg-opacity-10 text-[var(--error)] p-4 rounded-xl text-center border border-[var(--error)]">
          {error}
          <div className="mt-2">
            <button
              onClick={fetchClasses}
              className="button button-light !min-h-0 !py-1 !px-3 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[var(--sage)] bg-opacity-30 rounded-full flex items-center justify-center mb-4">
            <FolderOpen
              size={32}
              className="text-[var(--muted-foreground)] opacity-50"
            />
          </div>
          <h4 className="text-xl font-serif">No classes found</h4>
          <p className="text-[var(--muted-foreground)] mt-2 mb-6">
            Create your first class to get started
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="button button-dark"
          >
            <Plus size={16} /> Create Class
          </button>
        </div>
      ) : (
        <div className="class-grid">
          {classes.map((cls, index) => (
            <ClassCard
              key={cls.id}
              classData={cls}
              index={index}
              onRefresh={fetchClasses}
            />
          ))}
        </div>
      )}

      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleClassCreated}
      />
    </>
  );
}
