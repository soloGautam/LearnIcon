export interface Learner {
  id: string;
  rank: number;
  name: string;
  role: string;
  xp: number;
  level: number;
  hasBuilderBadge: boolean;
  plan: string;
  skills: string[];
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
  location: string;
  projects: { name: string; desc: string }[];
}

// All seeded fake learners removed. Real users will appear here once the
// backend leaderboard ships.
export const ALL_LEARNERS: Learner[] = [];
