"use client";

import { useState } from "react";
import DocumentCard from "./DocumentCard";
import UploadDocumentModal from "./UploadDocumentModal";
import { Plus, RefreshCw, FileText } from "lucide-react";

export default function DocumentGrid({ classId, subjectId, documents, onRefresh, isAdmin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await onRefresh(false);
    setIsSyncing(false);
  };

  const readyCount = documents.filter(
    (d) => d.status === "ready" || d.isAiEnriched
  ).length;
  const convertingCount = documents.filter((d) => d.status === "converting").length;
  const failedCount = documents.filter((d) => d.status === "failed").length;

  return (
    <div className="space-y-0">
      {/* ── Section heading ── */}
      <div className="section-heading !mt-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-serif m-0">Documents</h3>
          {documents.length > 0 && (
            <span className="count !text-sm !font-sans">{documents.length}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="button button-light !min-h-0 !py-2 !px-3 text-xs flex items-center gap-1.5 disabled:opacity-60"
            title="Refresh document statuses"
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
            Sync
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="button button-dark !min-h-0 !py-2 !px-4 text-xs flex items-center gap-1.5"
          >
            <Plus size={13} />
            Upload
          </button>
        </div>
      </div>

      {/* ── Status summary bar (shown when there's mixed states) ── */}
      {documents.length > 0 && (convertingCount > 0 || failedCount > 0) && (
        <div className="flex gap-4 pb-4 text-[11px] text-[var(--muted-foreground)]">
          {readyCount > 0 && (
            <span className="status ready">{readyCount} ready</span>
          )}
          {convertingCount > 0 && (
            <span className="status processing">{convertingCount} processing</span>
          )}
          {failedCount > 0 && (
            <span className="status failed">{failedCount} failed</span>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {documents.length === 0 ? (
        <div className="border-t border-[var(--border)] py-16 flex flex-col items-center text-center">
          <div className="doc-icon !w-14 !h-14 mb-4">
            <FileText size={24} />
          </div>
          <h4 className="text-lg font-serif m-0">No documents yet</h4>
          <p className="text-[var(--muted-foreground)] mt-2 text-sm max-w-sm">
            Upload a PDF or image and Gemini will automatically generate a
            title, summary, and topic tags for you.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="button button-dark mt-6 text-sm"
          >
            <Plus size={14} />
            Upload First Document
          </button>
        </div>
      ) : (
        /* ── Document list ── */
        <div className="document-list">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              classId={classId}
              subjectId={subjectId}
              onRefresh={onRefresh}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <UploadDocumentModal
        classId={classId}
        subjectId={subjectId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
