"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classApi } from "@/lib/api";
import { X } from "lucide-react";

const updateClassSchema = z.object({
  className: z
    .string()
    .trim()
    .min(1, "Class name is required")
    .max(50, "Class name must be at most 50 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(255, "Description must be at most 255 characters")
    .optional(),
}).refine(
  (data) => data.className !== undefined || data.description !== undefined,
  { message: "Provide at least one of className or description to update" }
);

export default function EditClassModal({ classData, isOpen, onClose, onSuccess }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateClassSchema),
  });

  useEffect(() => {
    if (classData) {
      setValue("className", classData.className || "");
      setValue("description", classData.description || "");
    }
  }, [classData, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await classApi.updateClass(classData.id, data);
      onSuccess(res.data?.class);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update class");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !classData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--background)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-xl font-serif m-0">Edit Class</h2>
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
              <span className="font-serif text-[14px] block mb-1">Class Name</span>
              <input 
                type="text" 
                placeholder="e.g. AP World History" 
                {...register("className")}
                className={`w-full p-2 rounded-lg border bg-[var(--background)] ${errors.className ? "border-[var(--error)]" : "border-[var(--border)] focus:border-[var(--primary)] outline-none"}`}
              />
              {errors.className && (
                <span className="text-[var(--error)] text-xs mt-1 block">{errors.className.message}</span>
              )}
            </label>
            
            <label className="block">
              <span className="font-serif text-[14px] block mb-1">Description <span className="text-[var(--muted-foreground)]">(Optional)</span></span>
              <textarea 
                placeholder="Brief description of the class focus..." 
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
