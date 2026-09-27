import TopBar from "@/components/TopBar";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SubjectDetailContent from "@/components/subjectDetail/SubjectDetailContent";

export default async function SubjectDetailPage({ params }) {
  const { id, subjectId } = await params;

  return (
    <ProtectedRoute>
      <div className="app-shell flex flex-col">
        <TopBar />

        <div className="border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/class/${id}`}
                className="back-button !mb-0 p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h2 className="text-2xl font-serif text-[var(--primary)] m-0">
                Subject Details
              </h2>
            </div>
            <button className="icon-button">
              <Settings size={20} />
            </button>
          </div>
        </div>

        <SubjectDetailContent classId={id} subjectId={subjectId} />
      </div>
    </ProtectedRoute>
  );
}
