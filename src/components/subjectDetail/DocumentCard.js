"use client";

import { useState, useEffect, useRef } from "react";
import { documentApi } from "@/lib/api";
import {
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status, isAiEnriched }) {
  if (status === "converting") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full text-[var(--ochre-dark)]" style={{background:'#f0e3c8'}}>
        <Loader2 size={12} className="animate-spin" />
        AI Processing…
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full text-[var(--error)]" style={{background:'var(--error-bg)', border:'1px solid var(--error-border)'}}>
        <XCircle size={12} />
        Processing Failed
      </span>
    );
  }
  if (status === "ready" || isAiEnriched) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--sage)] text-[var(--sage-dark)]">
        <CheckCircle2 size={12} />
        AI Ready
      </span>
    );
  }
  return null;
}

// ── Skeleton card for "converting" state ──────────────────────────────────────

function DocumentCardSkeleton({ name, mimeType, onSync }) {
  const isImage = mimeType?.startsWith("image/");
  const Icon = isImage ? ImageIcon : FileText;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4 opacity-80">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--primary)]">
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--ink)] leading-snug truncate">{name}</p>
          <div className="mt-1.5">
            <StatusBadge status="converting" />
          </div>
        </div>
      </div>

      {/* Shimmer content blocks */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Clock size={12} />
          <span>Gemini is reading and analysing your document…</span>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--muted)] animate-pulse w-full" />
        <div className="h-2.5 rounded-full bg-[var(--muted)] animate-pulse w-5/6" />
        <div className="h-2.5 rounded-full bg-[var(--muted)] animate-pulse w-3/4" />
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[var(--border)] flex justify-end">
        <button
          onClick={onSync}
          className="button button-light !min-h-0 !py-1.5 !px-3 text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={12} />
          Check Status
        </button>
      </div>
    </div>
  );
}

// ── Main DocumentCard ─────────────────────────────────────────────────────────

export default function DocumentCard({ doc, classId, subjectId, onRefresh, isAdmin }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [localError, setLocalError] = useState(null);
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
          // silent
        }
      }, 4000);
    }
    return () => clearInterval(pollingRef.current);
  }, [doc.status, doc.id, classId, subjectId, onRefresh]);

  // Cleanup confirm timer on unmount
  useEffect(() => {
    return () => clearTimeout(confirmTimerRef.current);
  }, []);

  const handleSync = async () => {
    try {
      await documentApi.checkConversionStatus(classId, subjectId, doc.id);
      if (onRefresh) onRefresh(true);
    } catch {
      // silent
    }
  };

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

  // Two-step delete: first click arms, second confirms
  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
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
      if (onRefresh) onRefresh(true);
    } catch (err) {
      setLocalError(err.message || "Delete failed");
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Skeleton while converting
  if (doc.status === "converting") {
    return (
      <DocumentCardSkeleton
        name={doc.documentName}
        mimeType={doc.mimeType}
        onSync={handleSync}
      />
    );
  }

  const isImage = doc.mimeType?.startsWith("image/");
  const Icon = isImage ? ImageIcon : FileText;
  const hasAiData = doc.isAiEnriched || doc.status === "ready";
  const displayTitle = doc.aiTitle || doc.documentName;
  const topics = Array.isArray(doc.topics) ? doc.topics : [];
  const sizeStr = formatBytes(doc.fileSize);
  const dateStr = formatDate(doc.createdAt);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col transition-shadow hover:shadow-md">

      {/* ── Card header ── */}
      <div className="p-5 pb-3 flex items-start gap-3">
        {/* File type icon */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--primary)]">
          <Icon size={24} />
        </div>

        {/* Title + status */}
        <div className="flex-1 min-w-0 pt-0.5">
          {/* AI title — serif, prominent */}
          <h3
            className="font-serif text-[17px] font-medium text-[var(--ink)] leading-snug tracking-tight"
            title={displayTitle}
          >
            {displayTitle}
          </h3>

          {/* Original filename when AI title differs */}
          {hasAiData && doc.aiTitle && doc.aiTitle !== doc.documentName && (
            <p
              className="text-[11px] text-[var(--muted-foreground)] mt-0.5 truncate font-mono"
              title={doc.documentName}
            >
              {doc.documentName}
            </p>
          )}

          {/* Status badge */}
          <div className="mt-2.5">
            <StatusBadge status={doc.status} isAiEnriched={doc.isAiEnriched} />
          </div>
        </div>
      </div>

      {/* ── File metadata strip ── */}
      <div className="px-5 pb-3 flex flex-wrap gap-x-3 gap-y-0.5">
        {sizeStr && (
          <span className="text-[11px] text-[var(--muted-foreground)] font-medium">{sizeStr}</span>
        )}
        {doc.mimeType && (
          <span className="text-[11px] text-[var(--muted-foreground)] uppercase font-medium tracking-wide">
            {doc.mimeType.split("/")[1]}
          </span>
        )}
        {dateStr && (
          <span className="text-[11px] text-[var(--muted-foreground)]">{dateStr}</span>
        )}
      </div>

      {/* ── Topics — numbered list (shown first) ── */}
      {topics.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)] mb-3">
            Key Topics
          </p>
          <ol className="flex flex-col gap-2">
            {topics.map((topic, i) => (
              <li key={topic} className="flex items-center gap-3">
                <span className="shrink-0 w-[22px] h-[22px] rounded-full text-[var(--ochre-dark)] flex items-center justify-center text-[11px] font-bold" style={{background:'#f0e3c8'}}>
                  {i + 1}
                </span>
                <span className="text-[13px] text-[var(--ink)] font-medium leading-snug">{topic}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── AI Summary — collapsible below topics ── */}
      {hasAiData && doc.aiSummary && (
        <div className="px-5 pb-4 border-t border-[var(--border)] pt-3">
          <button
            onClick={() => setShowSummary((v) => !v)}
            className="flex items-center gap-1.5 mb-0 group w-full text-left"
          >
            <Sparkles size={12} className="text-[var(--primary)] shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--primary)] flex-1">
              AI Summary
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] group-hover:text-[var(--ink)] transition-colors">
              {showSummary ? "Hide ↑" : "Show more ↓"}
            </span>
          </button>

          {showSummary && (
            <p className="mt-3 text-[13px] text-[var(--muted-foreground)] leading-[1.75] font-serif">
              {doc.aiSummary}
            </p>
          )}
        </div>
      )}

      {/* ── Error message ── */}
      {(localError || doc.processingError) && (
        <div className="error-banner mx-5 mb-4">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {localError || doc.processingError}
          </span>
        </div>
      )}

      {/* ── Actions footer ── */}
      <div className="mt-auto px-5 py-3 border-t border-[var(--border)] bg-[var(--background)] flex flex-wrap gap-2">
        {/* View */}
        <button
          onClick={() => window.open(doc.filePath, "_blank")}
          className="button button-dark !min-h-0 !py-2 !px-4 text-sm flex items-center gap-1.5 flex-1 justify-center"
        >
          <ExternalLink size={13} />
          View Document
        </button>

        {/* Retry AI — only on failed */}
        {doc.status === "failed" && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="button button-light !min-h-0 !py-2 !px-4 text-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {isRetrying ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <RefreshCw size={13} />
            )}
            {isRetrying ? "Processing…" : "Retry AI"}
          </button>
        )}

        {/* Delete — admin only, two-step */}
        {isAdmin && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title={confirmDelete ? "Click again to confirm delete" : "Delete document"}
            className={`button !min-h-0 !py-2 !px-4 text-sm flex items-center gap-1.5 transition-all duration-200 disabled:opacity-40 ${
              confirmDelete
                ? "bg-[var(--error)] !border-[var(--error)] text-white"
                : "button-light !text-[var(--error)]"
            }`}
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            {isDeleting ? "Deleting…" : confirmDelete ? "Confirm Delete" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
