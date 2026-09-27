"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { subjectApi } from "@/lib/api";
import { X } from "lucide-react";

const updateSubjectSchema = z.object({
  subjectName: z
    .string()
    .trim()
    .min(1, "Subject name is required")
    .max(50, "Subject name must be at most 50 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(255, "Description must be at most 255 characters")
    .optional(),
}).refine(
  (data) => data.subjectName !== undefined || data.description !== undefined,
  { message: "Provide at least one of subjectName or description to update" }
);

export default function EditSubjectModal({ classId, subject, isOpen, onClose, onSuccess }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSubjectSchema),
  });

  useEffect(() => {
    if (subject) {
      setValue("subjectName", subject.subjectName || "");
      setValue("description", subject.description || "");
    }
  }, [subject, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // Just in case the backend schema also secretly expects classId in body for updates
      const payload = { ...data, classId };
      const res = await subjectApi.updateSubject(classId, subject.id, payload);
      onSuccess(res.data?.subject);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update subject");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--background)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-xl font-serif m-0">Edit Subject</h2>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} className="p-1 hover:bg-[var(--muted)] rounded-full transition-colors">
            <X size={20} className="text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="error-banner mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <label className="block">
              <span className="font-serif text-[14px] block mb-1">Subject Name</span>
              <input 
                type="text" 
                placeholder="e.g. Unit 1: The Global Tapestry" 
                {...register("subjectName")}
                className={`w-full p-2 rounded-lg border bg-[var(--background)] ${errors.subjectName ? "border-[var(--error)]" : "border-[var(--border)] focus:border-[var(--primary)] outline-none"}`}
              />
              {errors.subjectName && (
                <span className="text-[var(--error)] text-xs mt-1 block">{errors.subjectName.message}</span>
              )}
            </label>
            
            <label className="block">
              <span className="font-serif text-[14px] block mb-1">Description <span className="text-[var(--muted-foreground)]">(Optional)</span></span>
              <textarea 
                placeholder="Brief description of the subject..." 
                rows={3}
                {...register("description")}
                className={`w-full p-2 rounded-lg border bg-[var(--background)] resize-none ${errors.description ? "border-[var(--error)]" : "border-[var(--border)] focus:border-[var(--primary)] outline-none"}`}
              />
              {errors.description && (
                <span className="text-[var(--error)] text-xs mt-1 block">{errors.description.message}</span>
              )}
            </label>

            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
                className="button button-light flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="button button-dark flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
