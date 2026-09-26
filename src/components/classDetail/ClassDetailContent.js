"use client";

import { useEffect, useState, useCallback } from "react";
import { classApi } from "@/lib/api";
import ClassDetailHeader from "./ClassDetailHeader";
import SubjectGrid from "./SubjectGrid";
import MembersSidebar from "./MembersSidebar";
import { useAuth } from "@/context/AuthContext";

export default function ClassDetailContent({ classId }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await classApi.getClassDetail(classId);
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load class details");
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (isLoading) {
    return (
      <div className="flex-1 main-content w-full py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 main-content w-full py-12">
        <div className="bg-[var(--error)] bg-opacity-10 text-[var(--error)] p-4 rounded-xl text-center border border-[var(--error)] max-w-lg mx-auto">
          <p>{error}</p>
          <button onClick={fetchDetail} className="button button-light !min-h-0 !py-1 !px-3 text-sm mt-4">Retry</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { class: classData, subjects, members, role } = data;

  return (
    <main className="flex-1 main-content w-full py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
          <ClassDetailHeader 
            classData={classData} 
            membersCount={members.length} 
            subjectsCount={subjects.length} 
          />
          <SubjectGrid 
            classId={classId} 
            subjects={subjects} 
            role={role} 
            onRefresh={fetchDetail} 
          />
        </div>
        <MembersSidebar 
          classId={classId} 
          members={members} 
          role={role} 
          onRefresh={fetchDetail} 
        />
      </div>
    </main>
  );
}
