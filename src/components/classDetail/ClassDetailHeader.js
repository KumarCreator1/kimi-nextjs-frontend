"use client";

export default function ClassDetailHeader({ classData, membersCount, subjectsCount }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl">{classData.className}</h1>
        <p className="lede mt-2 text-lg">
          {classData.description || 'No description provided'}
        </p>
        <div className="detail-stats !mt-6 !py-4 border-y border-[var(--border)]">
          <span>
            <strong>{membersCount}</strong> Students
          </span>
          <span>
            <strong>{subjectsCount}</strong> Subjects
          </span>
        </div>
      </div>
    </div>
  );
}
