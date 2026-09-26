"use client";

import { useState, useEffect, useRef } from "react";
import { documentApi } from "@/lib/api";
import {
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Download,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Hash,
  Clock,
  XCircle,
  Trash2,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Status pill ───────────────────────────────────────────────────────────────

function StatusPill({ status, isAiEnriched }) {
  if (status === "converting") {
    return (
      <span className="status processing flex items-center gap-1 text-[11px] font-medium">
        <Loader2 size={11} className="animate-spin" />
        AI Processing…
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="status failed flex items-center gap-1 text-[11px] font-medium">
        <XCircle size={11} />
        Failed
      </span>
    );
  }
  if (status === "ready" || isAiEnriched) {
    return (
      <span className="status ready flex items-center gap-1 text-[11px] font-medium">
        <CheckCircle2 size={11} />
        AI Ready
      </span>
    );
  }
  return null;
}

// ── Skeleton shimmer for "converting" state ───────────────────────────────────

function DocumentRowSkeleton({ name, mimeType, onDelete, classId, subjectId, docId, onSync }) {
  const isImage = mimeType?.startsWith("image/");
  const Icon = isImage ? ImageIcon : FileText;

  return (
    <div className="document-row group select-none cursor-default opacity-80">
      <div className="doc-icon">
        <Icon size={18} />
      </div>

      <div className="doc-details flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--ink)] truncate">{name}</p>
        <div className="flex items-center gap-3 mt-1">
          <StatusPill status="converting" />
          <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
            <Clock size={10} />
            Gemini is reading your document…
          </span>
        </div>
        {/* Animated shimmer bars mimicking AI content */}
        <div className="mt-3 space-y-2">
          <div className="h-2 rounded-full bg-[var(--muted)] animate-pulse w-3/4" />
          <div className="h-2 rounded-full bg-[var(--muted)] animate-pulse w-1/2" />
        </div>
      </div>

      <button
        onClick={onSync}
        className="shrink-0 text-button text-[11px] flex items-center gap-1 hover:text-[var(--ink)] transition-colors"
        title="Check status"
      >
        <RefreshCw size={12} />
        Sync
      </button>
    </div>
  );
}

// ── Main DocumentRow ──────────────────────────────────────────────────────────

export default function DocumentCard({ doc, classId, subjectId, onRefresh, isAdmin }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const pollingRef = useRef(null);
  const confirmTimerRef = useRef(null);

  // Auto-poll when converting
  useEffect(() => {
    if (doc.status === "converting") {
      pollingRef.current = setInterval(async () => {
        try {
          await documentApi.checkConversionStatus(classId, subjectId, doc.id);
          if (onRefresh) onRefresh(true);
        } catch {
          // silent — no toast spam during polling
        }
      }, 4000);
    }
    return () => clearInterval(pollingRef.current);
  }, [doc.status, doc.id, classId, subjectId, onRefresh]);

  const handleSync = async () => {
    try {
      await documentApi.checkConversionStatus(classId, subjectId, doc.id);
      if (onRefresh) onRefresh(true);
    } catch {
      // silent
    }
  };

  // Two-step delete: first click arms it (3s window), second click confirms.
  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-disarm after 3 seconds if user doesn't confirm
      confirmTimerRef.current = setTimeout(() => setConfirmDelete(false), 3000);
    } else {
      clearTimeout(confirmTimerRef.current);
      handleDeleteConfirm();
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setLocalError(null);
    try {
      await documentApi.deleteDocument(classId, subjectId, doc.id);
      if (onRefresh) onRefresh(true); // silent refresh removes the row
    } catch (err) {
      setLocalError(err.message || "Delete failed");
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(confirmTimerRef.current);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setLocalError(null);
    try {
      await documentApi.enrichDocument(classId, subjectId, doc.id);
      if (onRefresh) onRefresh(true);
    } catch (err) {
      setLocalError(err.message || "Retry failed");
    } finally {
      setIsRetrying(false);
    }
  };

  // Skeleton while converting
  if (doc.status === "converting") {
    return (
      <DocumentRowSkeleton
        name={doc.documentName}
        mimeType={doc.mimeType}
        classId={classId}
        subjectId={subjectId}
        docId={doc.id}
        onSync={handleSync}
      />
    );
  }

  const isImage = doc.mimeType?.startsWith("image/");
  const Icon = isImage ? ImageIcon : FileText;
  const hasAiData = doc.isAiEnriched || doc.status === "ready";
  const displayTitle = doc.aiTitle || doc.documentName;
  const topics = Array.isArray(doc.topics) ? doc.topics : [];
  const hashtags = Array.isArray(doc.hashtags) ? doc.hashtags : [];
  const sizeStr = formatBytes(doc.fileSize);
  const dateStr = formatDate(doc.createdAt);
  const hasExpandable = hasAiData && (doc.aiSummary || topics.length > 0);

  return (
    <div
      className={`document-row group flex-col !items-start !gap-0 transition-all duration-200 ${
        hasAiData ? "hover:bg-[#fffdf8]" : ""
      } ${isExpanded ? "!bg-[#fffdf8]" : ""}`}
    >
      {/* ── Top row ── */}
      <div className="flex items-start gap-4 w-full">
        <div className="doc-icon shrink-0 mt-0.5">
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-sm font-medium text-[var(--ink)] leading-snug">
            {displayTitle}
            {hasAiData && doc.aiTitle && doc.aiTitle !== doc.documentName && (
              <span className="ml-2 text-[10px] font-normal text-[var(--muted-foreground)] font-sans">
                (AI title)
              </span>
            )}
          </p>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <StatusPill status={doc.status} isAiEnriched={doc.isAiEnriched} />

            {sizeStr && (
              <span className="text-[11px] text-[var(--muted-foreground)]">{sizeStr}</span>
            )}
            {dateStr && (
              <span className="text-[11px] text-[var(--muted-foreground)]">{dateStr}</span>
            )}
            {doc.mimeType && (
              <span className="text-[11px] text-[var(--muted-foreground)] uppercase">
                {doc.mimeType.split("/")[1]}
              </span>
            )}
          </div>

          {/* Topic tags */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {topics.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {hashtags.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-0.5 text-[10px] text-[var(--primary)] font-medium"
                >
                  <Hash size={9} />
                  {h.replace(/^#/, "")}
                </span>
              ))}
            </div>
          )}

          {/* Failure error */}
          {(doc.status === "failed" || localError) && (
            <div className="flex items-start gap-2 mt-2 text-[11px] text-[var(--failed,#a25a4d)]">
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              <span className="line-clamp-2 text-[var(--muted-foreground)]">
                {localError || doc.processingError || "AI processing failed."}
              </span>
            </div>
          )}
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto pl-2">
          {/* Expand/collapse AI summary */}
          {hasExpandable && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="icon-button !w-8 !h-8 !min-w-0 !rounded-lg"
              title={isExpanded ? "Collapse" : "Show AI summary"}
            >
              <Sparkles size={14} className="text-[var(--primary)]" />
            </button>
          )}

          {/* Retry AI — only on failed */}
          {doc.status === "failed" && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="button button-light !min-h-0 !py-1 !px-3 text-[11px] flex items-center gap-1 disabled:opacity-50"
            >
              {isRetrying ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <RefreshCw size={11} />
              )}
              Retry AI
            </button>
          )}

          {/* View / Download */}
          <button
            onClick={() => window.open(doc.filePath, "_blank")}
            className="button button-light !min-h-0 !py-1 !px-3 text-[11px] flex items-center gap-1"
            title="View document"
          >
            <Download size={11} />
            View
          </button>

          {/* Delete — admin only, two-step confirmation */}
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title={confirmDelete ? "Click again to confirm delete" : "Delete document"}
              className={`button !min-h-0 !py-1 !px-3 text-[11px] flex items-center gap-1 transition-all duration-200 disabled:opacity-40 ${
                confirmDelete
                  ? "bg-[var(--error)] !border-[var(--error)] text-white hover:opacity-90"
                  : "button-light text-[var(--error)] hover:bg-[var(--error)] hover:text-white hover:!border-[var(--error)]"
              }`}
            >
              {isDeleting ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Trash2 size={11} />
              )}
              {isDeleting ? "Deleting…" : confirmDelete ? "Confirm" : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* ── Expandable AI Summary panel ── */}
      {isExpanded && doc.aiSummary && (
        <div
          className="w-full mt-3 ml-10 pl-4 border-l-2 border-[var(--border)] animate-in fade-in slide-in-from-top-1 duration-200"
          style={{ maxWidth: "calc(100% - 2.5rem)" }}
        >
          <p className="eyebrow flex items-center gap-1 mb-2">
            <Sparkles size={10} />
            AI Summary
          </p>
          <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed">
            {doc.aiSummary}
          </p>
        </div>
      )}
    </div>
  );
}
