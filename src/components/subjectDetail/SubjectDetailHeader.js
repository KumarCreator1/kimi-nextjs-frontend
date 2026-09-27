"use client";

import { BookOpen, Files, Sparkles } from "lucide-react";

export default function SubjectDetailHeader({ subjectData, documents = [] }) {
  const readyCount = documents.filter(
    (d) => d.status === "ready" || d.isAiEnriched
  ).length;
  const totalCount = documents.length;

  return (
    <div className="space-y-1">
      <p className="eyebrow flex items-center gap-1.5">
        <BookOpen size={10} />
        Subject
      </p>
      <h1 className="!text-4xl !mt-1 !mb-0">{subjectData.subjectName}</h1>

      {subjectData.description && (
        <p className="lede !mt-2">{subjectData.description}</p>
      )}

      <div className="detail-stats !mt-4">
        <span>
          <strong>{totalCount}</strong>
          <span className="text-sm"> Documents</span>
        </span>
        {readyCount > 0 && (
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[var(--primary)]" />
            <strong>{readyCount}</strong>
            <span className="text-sm"> AI enriched</span>
          </span>
        )}
      </div>
    </div>
  );
}
