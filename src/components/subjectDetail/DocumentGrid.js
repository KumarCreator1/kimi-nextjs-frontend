"use client";

import { useState } from "react";
import DocumentCard from "./DocumentCard";
import UploadDocumentModal from "./UploadDocumentModal";
import { Plus } from "lucide-react";

export default function DocumentGrid({ classId, subjectId, documents, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="section-heading !mt-0 flex items-center justify-between">
        <h3 className="text-2xl font-serif">Documents</h3>
        <button onClick={() => setIsModalOpen(true)} className="button button-light">
          <Plus size={16} /> Upload Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center flex flex-col items-center">
          <h4 className="text-lg font-serif">No documents yet</h4>
          <p className="text-[var(--muted-foreground)] mt-2 text-sm max-w-md mx-auto">
            Upload PDFs or images to build your academic workspace. Note: DOCX files are temporarily disabled.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="button button-dark mt-4">
            <Plus size={14} /> Upload First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              doc={doc} 
              classId={classId} 
              subjectId={subjectId} 
              onRefresh={onRefresh} 
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
