import TopBar from "@/components/TopBar";
import {
  ChevronRight,
  MoreHorizontal,
  Users,
  Bell,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  const classes = [
    {
      name: "Class 3A",
      subject:
        "Computer organization and architecture Computer organization and architecture",
      teacher: "Ms. Aiko Tanaka",
      accent: "clay",
      students: 24,
      next: "The Great Gatsby · Ch. 4",
    },
    {
      name: "Class 2B",
      subject: "World History",
      teacher: "Mr. Kenji Sato",
      accent: "sage",
      students: 19,
      next: "Silk Road seminar",
    },
    {
      name: "Class 1C",
      subject: "Creative Writing",
      teacher: "Ms. Hana Mori",
      accent: "ochre",
      students: 22,
      next: "Portfolio review",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="app-shell flex flex-col">
        <TopBar />

        <main className="flex-1 main-content w-full">
          <section className="page-section">
            <div className="intro-row">
              <div>
                <p className="eyebrow">Tuesday, April 16, 2024</p>
                <h1>Good morning, Aiko.</h1>
                <p className="lede">
                  A quiet place for everything your classes need.
                </p>
              </div>
              <button className="button button-dark">
                <Bell size={16} /> <span>1 pending request</span>
              </button>
            </div>

            <div className="section-heading">
              <h2>Your classes</h2>
              <button className="text-button">
                View all <ChevronRight size={16} />
              </button>
            </div>

            <div className="class-grid">
              {classes.map((item, index) => (
                <Link
                  href={`/class/${index + 1}`}
                  className={`class-card ${item.accent}`}
                  key={item.name}
                >
                  <div className="card-top">
                    <span className="class-number">{index + 1}</span>
                    <MoreHorizontal size={20} />
                  </div>
                  <div className="class-copy">
                    <p>{item.name}</p>
                    <h3>{item.subject}</h3>
                    <span>{item.next}</span>
                  </div>
                  <div className="class-meta">
                    <span>
                      <Users size={14} /> {item.students} students
                    </span>
                  </div>
                  <div className="card-footer">
                    <span>{item.teacher}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="lower-grid">
              <div className="paper-panel">
                <div className="panel-title flex items-center justify-between">
                  <div>
                    <p className="eyebrow">At a glance</p>
                    <h2>Keep the thread</h2>
                  </div>
                  <Sparkles size={24} />
                </div>
                <p className="panel-copy my-4">
                  Your next conversation starts with a shared page. Pick up
                  where your classes left off.
                </p>
                <button className="button button-light">
                  Open Class 3A <ChevronRight size={16} />
                </button>
              </div>

              <div className="quote-panel">
                <span className="quote-mark">“</span>
                <blockquote>
                  Learning is not a race. It is a way of staying curious
                  together.
                </blockquote>
                <span className="quote-by">— KIMI NO note</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
