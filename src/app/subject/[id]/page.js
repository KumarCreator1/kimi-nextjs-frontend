import TopBar from "@/components/TopBar";
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  Plus,
  Clock,
  FileType,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default async function SubjectDetailPage({ params }) {
  const { id } = await params;

  const documents = [
    {
      id: 1,
      name: "Trade routes in the Indian Ocean",
      size: "2.4 MB",
      type: "PDF",
      date: "Oct 12, 2026",
      status: "ready",
    },
    {
      id: 2,
      name: "Mali Empire Economics",
      size: "1.1 MB",
      type: "PDF",
      date: "Oct 14, 2026",
      status: "ready",
    },
    {
      id: 3,
      name: "Silk Road Primary Sources",
      size: "3.5 MB",
      type: "DOCX",
      date: "Oct 15, 2026",
      status: "processing",
    },
    {
      id: 4,
      name: "Map of Eurasian Exchange",
      size: "5.2 MB",
      type: "JPG",
      date: "Oct 15, 2026",
      status: "failed",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="app-shell flex flex-col">
        <TopBar />

        <div className="border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4 flex items-center gap-4">
            <Link
              href="/class/1"
              className="back-button !mb-0 p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-2xl font-serif text-[var(--primary)] m-0">
              Unit 2: Networks of Exchange
            </h2>
          </div>
        </div>

        <main className="flex-1 main-content w-full py-12">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-serif">
                Unit 2: Networks of Exchange
              </h1>
              <p className="text-lg text-[var(--muted-foreground)]">
                Silk roads, Indian ocean, and trans-Saharan trade routes.
                Exploring the interconnectedness of Afro-Eurasia.
              </p>
            </div>

            <div className="space-y-6">
              <div className="section-heading">
                <h3 className="text-2xl font-serif m-0">Documents</h3>
                <button className="button button-dark">
                  <Plus size={16} /> Add Document
                </button>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
                {documents.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[var(--sage)] bg-opacity-30 rounded-full flex items-center justify-center mb-4">
                      <FileText
                        size={32}
                        className="text-[var(--muted-foreground)] opacity-50"
                      />
                    </div>
                    <h4 className="text-lg font-serif">
                      No notes yet in this subject
                    </h4>
                    <p className="text-sm text-[var(--muted-foreground)] mt-2">
                      Upload your first document to get started
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-4 p-4 hover:bg-[var(--muted)] transition-colors group"
                      >
                        <div className="w-12 h-12 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--primary)] shrink-0">
                          <FileText size={24} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[var(--ink)] truncate">
                            {doc.name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-xs text-[var(--muted-foreground)]">
                            <span className="flex items-center gap-1">
                              <FileType size={12} /> {doc.type} • {doc.size}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {doc.date}
                            </span>

                            {doc.status === "ready" && (
                              <span className="flex items-center gap-1 text-[var(--success)]">
                                <CheckCircle2 size={12} /> Ready
                              </span>
                            )}
                            {doc.status === "processing" && (
                              <span className="flex items-center gap-1 text-[var(--warning)]">
                                <Loader2 size={12} className="animate-spin" />{" "}
                                Processing via AI
                              </span>
                            )}
                            {doc.status === "failed" && (
                              <span className="flex items-center gap-1 text-[var(--error)]">
                                <AlertCircle size={12} /> Failed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="icon-button !w-10 !h-10 hover:bg-white"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="icon-button !w-10 !h-10 hover:bg-red-50 text-[var(--error)]"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
