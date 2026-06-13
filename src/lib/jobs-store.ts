export type RoleType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface JobListing {
  id: string;
  companyName: string;
  companyEmail: string;
  title: string;
  roleType: RoleType;
  location: string;
  minXpLevel: number;
  requiresBuilderBadge: boolean;
  description: string;
  postedAt: string;
}

const KEY = "learnico:jobs";

export function getJobs(): JobListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JobListing[];
  } catch {
    return [];
  }
}

export function saveJob(job: Omit<JobListing, "id" | "postedAt">): JobListing {
  const all = getJobs();
  const newJob: JobListing = {
    ...job,
    id: crypto.randomUUID(),
    postedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([newJob, ...all]));
  return newJob;
}

export function deleteJob(id: string): void {
  const all = getJobs().filter((j) => j.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getJobsByCompany(email: string): JobListing[] {
  return getJobs().filter((j) => j.companyEmail === email);
}
