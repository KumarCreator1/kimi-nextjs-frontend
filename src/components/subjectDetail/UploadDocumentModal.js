"use client";

import { useState } from "react";
import { documentApi } from "@/lib/api";
import { X, UploadCloud, AlertCircle, Loader2 } from "lucide-react";

// Two upload stages for clear user feedback
const STAGE = {
  IDLE: "idle",
  UPLOADING_CLOUD: "uploading_cloud", // Step 1: browser → Cloudinary (0 backend RAM used)
  SAVING: "saving",                   // Step 2: Cloudinary URL → our backend
};

const STAGE_LABEL = {
  [STAGE.UPLOADING_CLOUD]: "Uploading to cloud…",
  [STAGE.SAVING]: "Saving & starting AI…",
};

export default function UploadDocumentModal({ classId, subjectId, isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState(STAGE.IDLE);

  const isLoading = stage === STAGE.UPLOADING_CLOUD || stage === STAGE.SAVING;

  const reset = () => {
    setFile(null);
    setError(null);
    setStage(STAGE.IDLE);
  };

  const handleClose = () => {
    if (isLoading) return; // prevent accidental close during upload
    reset();
    onClose();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!["application/pdf", "image/jpeg", "image/png"].includes(selected.type)) {
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
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset || cloudName === "your_cloud_name_here") {
      setError(
        "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local and restart the dev server."
      );
      return;
    }

    setError(null);

    try {
      // ── Step 1: Upload directly from the browser to Cloudinary ──
      // The Node backend never touches the binary — zero RAM used on Render.
      setStage(STAGE.UPLOADING_CLOUD);
      const cloudFormData = new FormData();
      cloudFormData.append("file", file);
      cloudFormData.append("upload_preset", uploadPreset);

      // 30-second timeout — prevents the fetch from hanging indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      console.log(`[Upload] Sending ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) to Cloudinary cloud: ${cloudName}, preset: ${uploadPreset}`);

      let cloudRes;
      try {
        cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: "POST", body: cloudFormData, signal: controller.signal }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      const cloudData = await cloudRes.json();
      console.log("[Upload] Cloudinary response:", cloudData.secure_url || cloudData.error);

      if (!cloudRes.ok) {
        throw new Error(
          cloudData.error?.message ||
          "Cloudinary upload failed. Check your cloud name and that the upload preset is set to Unsigned."
        );
      }

      // ── Step 2: Send the Cloudinary URL + metadata to our backend ──
      // Backend inserts to DB with status:"converting" and kicks off background Gemini job.
      setStage(STAGE.SAVING);
      const payload = {
        documentName: file.name,
        filePath: cloudData.secure_url,
        fileSize: file.size,
        mimeType: file.type,
      };

      const res = await documentApi.uploadDocument(classId, subjectId, payload);

      // Axios interceptor returns response.data (the full API body).
      // Backend shape: { success, statusCode, message, data: { document } }
      const newDocument = res?.data?.document;
      reset();
      onSuccess(newDocument);
      onClose();
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
      setStage(STAGE.IDLE);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--background)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[var(--border)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-xl font-serif m-0">Upload Document</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 hover:bg-[var(--muted)] rounded-full transition-colors disabled:opacity-40"
          >
            <X size={20} className="text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="p-6">
          {/* Error banner */}
          {error && (
            <div className="error-banner mb-4">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drop zone */}
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
              {file ? (
                <p className="text-xs text-[var(--muted-foreground)]">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB &middot; {file.type}
                </p>
              ) : (
                <p className="text-xs text-[var(--muted-foreground)]">
                  PDF, JPG, PNG up to 25MB
                </p>
              )}
            </div>

            {/* Two-stage progress indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 bg-[var(--muted)] rounded-lg px-4 py-3 text-sm">
                <Loader2 size={16} className="animate-spin text-[var(--primary)] shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[var(--foreground)]">{STAGE_LABEL[stage]}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {stage === STAGE.UPLOADING_CLOUD
                      ? "Your file is going directly to the cloud."
                      : "AI processing will start in the background."}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="button button-light flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !file}
                className="button button-dark flex-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> {STAGE_LABEL[stage]}</>
                ) : (
                  <><UploadCloud size={14} /> Upload</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
