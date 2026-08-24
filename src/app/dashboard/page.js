import TopBar from "@/components/TopBar";
import { ChevronRight, Sparkles } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ClassGrid from "@/components/dashboard/ClassGrid";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="app-shell flex flex-col">
        <TopBar />

        <main className="flex-1 main-content w-full">
          <section className="page-section">
            <DashboardHeader />
            <ClassGrid />

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
                  Open Recent Class <ChevronRight size={16} />
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
