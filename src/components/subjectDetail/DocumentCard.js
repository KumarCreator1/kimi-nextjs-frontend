"use client";

import { useState, useEffect } from "react";
import { documentApi } from "@/lib/api";
import { FileText, Image as ImageIcon, Sparkles, AlertCircle, Download, FileCheck2, Loader2 } from "lucide-react";

export default function DocumentCard({ doc, classId, subjectId, onRefresh }) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    
    if (doc.status === "converting" || doc.status === "converted") {
      intervalId = setInterval(async () => {
        try {
          if (doc.status === "converting") {
            await documentApi.checkConversionStatus(classId, subjectId, doc.id);
          } else {
            await documentApi.getDocumentDetail(classId, subjectId, doc.id);
          }
          if (onRefresh) onRefresh(true);
        } catch (err) {
          // Silent catch to prevent UI errors during polling
          console.error("Polling error:", err);
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [doc.status, doc.id, classId, subjectId, onRefresh]);

  const handleEnrich = async (e) => {
    e.preventDefault();
    setIsEnriching(true);
    setError(null);
    try {
      await documentApi.enrichDocument(classId, subjectId, doc.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "AI Enrichment failed");
      setIsEnriching(false);
    }
  };

  const isImage = doc.mimeType?.startsWith("image/");
  const Icon = isImage ? ImageIcon : FileText;
  
  // Compute display status
  let statusBadge = null;
  if (doc.status === "converting") {
    statusBadge = (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[var(--ochre)] bg-opacity-20 text-[var(--ochre-dark)] flex items-center gap-1">
        <Loader2 size={10} className="animate-spin" /> Converting
      </span>
    );
  } else if (doc.status === "converted") {
    statusBadge = (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#3b82f6] bg-opacity-20 text-[#2563eb] flex items-center gap-1">
        <Loader2 size={10} className="animate-spin" /> Processing AI
      </span>
    );
  } else if (doc.status === "failed") {
    statusBadge = (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[var(--error)] bg-opacity-10 text-[var(--error)] flex items-center gap-1">
        <AlertCircle size={10} /> Failed
      </span>
    );
  } else if (doc.isAiEnriched || doc.status === "ready") {
    statusBadge = (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[var(--sage)] bg-opacity-30 text-[var(--sage-dark)] flex items-center gap-1">
        <FileCheck2 size={10} /> Ready
      </span>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--primary)] transition-colors flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-3 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] shrink-0">
            <Icon size={24} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-[var(--ink)] truncate" title={doc.documentName}>
              {doc.documentName}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {statusBadge}
            </div>
          </div>
        </div>
      </div>

      {doc.aiSummary && (
        <div className="mb-4 text-xs text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
          <strong>AI Summary:</strong> {doc.aiSummary}
        </div>
      )}

      {/* Show local error or backend processing error */}
      {(error || doc.processingError) && (
        <div className="mb-4 text-xs text-[var(--error)] bg-[var(--error)] bg-opacity-10 p-2 rounded flex items-start gap-1.5">
          <AlertCircle size={12} className="shrink-0 mt-0.5" />
          <span className="break-words line-clamp-2">
            {error || doc.processingError}
          </span>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center gap-2">
        {/* Action Buttons */}
        <button 
          onClick={() => window.open(doc.filePath, "_blank")}
          className="button button-light flex-1 !min-h-0 !py-2 text-xs flex justify-center items-center gap-1.5"
          disabled={doc.status === "converting"}
          title="Download Document"
        >
          <Download size={14} /> View
        </button>

        {doc.status === "failed" && (
          <button 
            onClick={handleEnrich}
            disabled={isEnriching}
            className="button button-dark flex-1 !min-h-0 !py-2 text-xs flex justify-center items-center gap-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--sage-dark)] hover:opacity-90 disabled:opacity-50"
            title="Retry AI Enrichment"
          >
            {isEnriching ? (
              <><Loader2 size={14} className="animate-spin" /> Processing...</>
            ) : (
              <><Sparkles size={14} /> Retry AI</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
