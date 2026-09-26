"use client";

import { useEffect, useState, useCallback } from "react";
import { subjectApi, documentApi } from "@/lib/api";
import SubjectDetailHeader from "./SubjectDetailHeader";
import DocumentGrid from "./DocumentGrid";
import { useAuth } from "@/context/AuthContext";

export default function SubjectDetailContent({ classId, subjectId }) {
  const { user } = useAuth();
  const [subjectData, setSubjectData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    if (!silent) setError(null);
    try {
      const [subjectRes, docRes] = await Promise.all([
        subjectApi.getSubjectDetail(classId, subjectId),
        documentApi.listDocuments(classId, subjectId)
      ]);
      setSubjectData(subjectRes.data?.subject);
      setDocuments(docRes.data?.documents || []);
    } catch (err) {
      if (!silent) setError(err.message || "Failed to load subject details");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [classId, subjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <main className="flex-1 main-content w-full py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 main-content w-full py-12">
        <div className="bg-[var(--error)] bg-opacity-10 text-[var(--error)] p-4 rounded-xl text-center border border-[var(--error)] max-w-lg mx-auto">
          <p>{error}</p>
          <button onClick={fetchData} className="button button-light !min-h-0 !py-1 !px-3 text-sm mt-4">Retry</button>
        </div>
      </main>
    );
  }

  if (!subjectData) return null;

  return (
    <main className="flex-1 main-content w-full py-12">
      <div className="space-y-12">
        <SubjectDetailHeader 
          subjectData={subjectData} 
          documentCount={documents.length} 
        />
        <DocumentGrid 
          classId={classId}
          subjectId={subjectId}
          documents={documents}
          onRefresh={fetchData}
        />
      </div>
    </main>
  );
}
