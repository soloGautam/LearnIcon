import { useEffect, type ReactNode } from "react";
import { Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { IntroGate } from "./components/IntroGate";
import { getAuth } from "./lib/auth-store";

import Dashboard from "./routes/index";
import About from "./routes/about";
import Chat from "./routes/chat";
import Faq from "./routes/faq";
import Leaderboard from "./routes/leaderboard";
import Login from "./routes/login";
import Opportunities from "./routes/opportunities";
import Plans from "./routes/plans";
import Profile from "./routes/profile";
import Projects from "./routes/projects.index";
import ProjectsNew from "./routes/projects.new";
import Rewards from "./routes/rewards";
import Studio from "./routes/studio";
import CorporateIndex from "./routes/corporate/index";
import CorporateJobs from "./routes/corporate/jobs";
import CorporateLearner from "./routes/corporate/learner.$id";
import CorporateOnboarding from "./routes/corporate/onboarding";
import CorporatePlans from "./routes/corporate/plans";
import CorporateProfile from "./routes/corporate/profile";
import CorporateTopLearners from "./routes/corporate/top-learners";

const CORPORATE_PATHS = [
  "/corporate",
  "/corporate/top-learners",
  "/corporate/plans",
  "/corporate/profile",
  "/corporate/onboarding",
  "/corporate/jobs",
  "/corporate/learner",
];
const PUBLIC_PATHS = ["/login"];

function isCorporate(pathname: string) {
  return CORPORATE_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function AuthGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const isCorporatePath = isCorporate(pathname);
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (isPublicPath) return;

    if (!auth.type) {
      navigate("/login");
      return;
    }

    if (auth.type === "corporate" && !isCorporatePath) {
      if (auth.corporate?.onboarded) navigate("/corporate");
      else navigate("/corporate/onboarding");
      return;
    }

    if (auth.type === "learner" && isCorporatePath) {
      navigate("/");
    }
  }, [pathname]);

  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isCorporatePath = isCorporate(pathname);
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  const routes = (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/new" element={<ProjectsNew />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="/corporate" element={<CorporateIndex />} />
      <Route path="/corporate/jobs" element={<CorporateJobs />} />
      <Route path="/corporate/learner/:id" element={<CorporateLearner />} />
      <Route path="/corporate/onboarding" element={<CorporateOnboarding />} />
      <Route path="/corporate/plans" element={<CorporatePlans />} />
      <Route path="/corporate/profile" element={<CorporateProfile />} />
      <Route path="/corporate/top-learners" element={<CorporateTopLearners />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <AuthGuard>
      {!isCorporatePath && !isPublicPath && <IntroGate />}
      {isCorporatePath || isPublicPath ? routes : <AppShell>{routes}</AppShell>}
    </AuthGuard>
  );
}
