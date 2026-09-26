"use client";

import { useState } from "react";
import { documentApi } from "@/lib/api";
import { X, UploadCloud, AlertCircle } from "lucide-react";

export default function UploadDocumentModal({ classId, subjectId, isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      // Basic client-side validation
      if (
        !['application/pdf', 'image/jpeg', 'image/png'].includes(selected.type)
      ) {
        setError("Only PDF, JPEG, and PNG files are allowed currently.");
        setFile(null);
        return;
      }
      if (selected.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await documentApi.uploadDocument(classId, subjectId, formData);
      setFile(null); // clear form
      onSuccess(res.data?.document); // notify parent
      onClose(); // close modal
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to upload document");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--background)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[var(--border)]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-xl font-serif m-0">Upload Document</h2>
          <button onClick={() => { setFile(null); setError(null); onClose(); }} className="p-1 hover:bg-[var(--muted)] rounded-full transition-colors">
            <X size={20} className="text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-[var(--error)] bg-opacity-10 text-[var(--error)] p-3 rounded-md text-sm border border-[var(--error)] mb-4 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:bg-[var(--muted)] transition-colors relative">
              <input 
                type="file" 
                accept="application/pdf,image/jpeg,image/png"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              <UploadCloud size={32} className="mx-auto text-[var(--muted-foreground)] mb-3" />
              <p className="text-sm font-medium mb-1">
                {file ? file.name : "Click or drag file to upload"}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                PDF, JPG, PNG up to 25MB (DOCX temporarily disabled)
              </p>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={() => { setFile(null); setError(null); onClose(); }}
                className="button button-light flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading || !file}
                className="button button-dark flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
