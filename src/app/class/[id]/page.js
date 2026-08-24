import TopBar from "@/components/TopBar";
import {
  ArrowLeft,
  Users,
  Settings,
  Plus,
  Book,
  FileText,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default async function ClassDetailPage({ params }) {
  const { id } = await params;

  const members = [
    {
      name: "Sarah Connor",
      email: "sarah@example.com",
      role: "Admin",
      badge: "clay",
    },
    {
      name: "John Smith",
      email: "john@example.com",
      role: "Member",
      badge: "sage",
    },
    {
      name: "Priya Patel",
      email: "priya@example.com",
      role: "Member",
      badge: "sage",
    },
  ];

  const subjects = [
    {
      id: 1,
      name: "Unit 1: The Global Tapestry",
      desc: "1200 to 1450 CE",
      docs: 14,
    },
    {
      id: 2,
      name: "Unit 2: Networks of Exchange",
      desc: "Silk roads, Indian ocean",
      docs: 8,
    },
    {
      id: 3,
      name: "Unit 3: Land-Based Empires",
      desc: "1450 to 1750 CE",
      docs: 5,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="app-shell flex flex-col">
        <TopBar />

        <div className="border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="back-button !mb-0 p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h2 className="text-2xl font-serif text-[var(--primary)] m-0">
                AP World History
              </h2>
            </div>
            <button className="icon-button">
              <Settings size={20} />
            </button>
          </div>
        </div>

        <main className="flex-1 main-content w-full py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content - Subjects */}
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl">AP World History</h1>
                  <p className="lede mt-2 text-lg">
                    Periods 1-4, modern era focus
                  </p>
                  <div className="detail-stats !mt-6 !py-4 border-y border-[var(--border)]">
                    <span>
                      <strong>24</strong> Students
                    </span>
                    <span>
                      <strong>8</strong> Subjects
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="section-heading !mt-0">
                  <h3 className="text-2xl font-serif">Subjects</h3>
                  <button className="button button-light">
                    <Plus size={16} /> Add Subject
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subjects.map((sub) => (
                    <Link
                      href={`/subject/${sub.id}`}
                      key={sub.id}
                      className="subject-card group !min-h-0 !p-6 hover:border-[var(--primary)] transition-colors bg-[var(--card)]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="text-xl font-serif text-[var(--primary)] group-hover:text-[var(--accent-hover)] transition-colors">
                            {sub.name}
                          </h4>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {sub.desc}
                          </p>
                        </div>
                        <div className="subject-illustration !h-12 !w-12 bg-[var(--sage)] rounded-lg text-[var(--primary)] opacity-70">
                          <Book size={24} />
                        </div>
                      </div>
                      <footer className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1.5">
                          <FileText size={14} /> {sub.docs} Documents
                        </span>
                        <span className="text-[var(--primary)] font-medium">
                          View →
                        </span>
                      </footer>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Members */}
            <div className="w-full lg:w-80 space-y-8">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif m-0">
                    Members{" "}
                    <span className="text-[var(--muted-foreground)] text-base font-sans">
                      (24)
                    </span>
                  </h3>
                  <button className="button button-light !min-h-[32px] !px-3 text-xs">
                    <Plus size={14} /> Add
                  </button>
                </div>

                <div className="space-y-4">
                  {members.map((member, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm text-[var(--ink)]">
                          {member.name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-opacity-30 ${member.badge} text-[var(--ink)]`}
                        >
                          {member.role}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 text-[var(--error)] hover:bg-white rounded p-1 transition-all">
                          <UserMinus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full text-center text-sm text-[var(--primary)] font-medium mt-6 pt-4 border-t border-[var(--border)] hover:underline">
                  View all members
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
