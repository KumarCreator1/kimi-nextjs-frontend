"use client";

export default function SubjectDetailHeader({ subjectData, documentCount }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl">{subjectData.subjectName}</h1>
        <p className="lede mt-2 text-lg">
          {subjectData.description || 'No description provided'}
        </p>
        <div className="detail-stats !mt-6 !py-4 border-y border-[var(--border)]">
          <span>
            <strong>{documentCount}</strong> Documents
          </span>
        </div>
      </div>
    </div>
  );
}
