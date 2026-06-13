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

export const ALL_LEARNERS: Learner[] = [
  {
    id: "1", rank: 1, name: "Aanya R.", role: "ML Engineer", xp: 18400, level: 18,
    hasBuilderBadge: true, plan: "Titan",
    skills: ["RAG", "Python", "LangChain", "Pinecone", "OpenAI"],
    email: "aanya.r@gmail.com", phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/aanya-r", github: "github.com/aanya-r",
    location: "Bangalore, India",
    bio: "Building production RAG systems for 3+ years. Currently open to senior ML engineer roles at AI-first companies. Love shipping fast and iterating in the open.",
    projects: [
      { name: "DocSearch AI", desc: "Production RAG pipeline for 100k+ docs" },
      { name: "ResumeRanker", desc: "LLM scoring system used by 3 startups" },
    ],
  },
  {
    id: "2", rank: 2, name: "Karthik S.", role: "AI Product Manager", xp: 15200, level: 16,
    hasBuilderBadge: true, plan: "Pro",
    skills: ["Product", "Prompting", "Agents", "LLMs", "Roadmapping"],
    email: "karthik.s@protonmail.com", phone: "+91 87654 32109",
    linkedin: "linkedin.com/in/karthik-s-pm", github: "github.com/karthik-builds",
    location: "Hyderabad, India",
    bio: "PM turned AI builder. I bridge product and engineering — shipping AI features that users actually want. Seeking AI PM roles at product-led companies.",
    projects: [
      { name: "AgentFlow", desc: "No-code AI agent builder for non-technical PMs" },
      { name: "FeedbackAI", desc: "LLM-powered user research synthesizer" },
    ],
  },
  {
    id: "3", rank: 3, name: "Mia T.", role: "Applied AI Engineer", xp: 13800, level: 15,
    hasBuilderBadge: true, plan: "Pro",
    skills: ["Fine-tuning", "FastAPI", "TypeScript", "Anthropic", "Evals"],
    email: "mia.t@hey.com", phone: "+1 415 234 5678",
    linkedin: "linkedin.com/in/mia-t-ai", github: "github.com/mia-t",
    location: "San Francisco, CA",
    bio: "Ex-academic researcher now building applied AI at startups. Specialise in fine-tuning and evals. Looking for applied AI roles on small, high-leverage teams.",
    projects: [
      { name: "TinyFineTune", desc: "LoRA fine-tuning toolkit for Claude" },
      { name: "EvalHarness", desc: "Open-source LLM evaluation framework" },
    ],
  },
  {
    id: "4", rank: 4, name: "Rohan P.", role: "Full Stack AI Engineer", xp: 12100, level: 14,
    hasBuilderBadge: true, plan: "Pro",
    skills: ["Next.js", "OpenAI", "Supabase", "TypeScript", "tRPC"],
    email: "rohan.p@outlook.com", phone: "+91 76543 21098",
    linkedin: "linkedin.com/in/rohan-p-dev", github: "github.com/rohanp",
    location: "Mumbai, India",
    bio: "Full stack dev who fell in love with AI. I ship end-to-end AI products from DB schema to prompt engineering. Open to founding engineer positions.",
    projects: [
      { name: "NoteAI", desc: "AI-powered note-taking with semantic search" },
      { name: "Shipper", desc: "One-click AI SaaS starter kit" },
    ],
  },
  {
    id: "5", rank: 5, name: "Priya K.", role: "Data Scientist", xp: 11300, level: 13,
    hasBuilderBadge: false, plan: "Builder",
    skills: ["Python", "Pandas", "Scikit-learn", "SQL", "dbt"],
    email: "priya.k@gmail.com", phone: "+91 65432 10987",
    linkedin: "linkedin.com/in/priya-k-data", github: "github.com/priya-k",
    location: "Chennai, India",
    bio: "5 years in data science, now moving into LLM-powered analytics. Passionate about turning messy data into clean insight. Open to DS + AI hybrid roles.",
    projects: [
      { name: "DataNarrator", desc: "Auto-generates plain English reports from SQL data" },
      { name: "AnomalyBot", desc: "LLM anomaly detector for time-series data" },
    ],
  },
  {
    id: "6", rank: 6, name: "Arjun M.", role: "LLM Engineer", xp: 10800, level: 13,
    hasBuilderBadge: true, plan: "Titan",
    skills: ["LLMs", "Embeddings", "Vector DBs", "Weaviate", "Python"],
    email: "arjun.m@fastmail.com", phone: "+91 54321 09876",
    linkedin: "linkedin.com/in/arjun-m-llm", github: "github.com/arjunm",
    location: "Delhi, India",
    bio: "Obsessed with semantic search and retrieval. Built 4 production vector DBs. Looking for LLM engineer roles at Series A–B startups.",
    projects: [
      { name: "VectorKit", desc: "Plug-and-play vector search for any SQL DB" },
      { name: "MemoryGPT", desc: "Long-term memory layer for LLM chatbots" },
    ],
  },
  {
    id: "7", rank: 7, name: "Sana W.", role: "AI Researcher", xp: 9900, level: 12,
    hasBuilderBadge: false, plan: "Pro",
    skills: ["Research", "PyTorch", "Transformers", "JAX", "Paper Writing"],
    email: "sana.w@academic.io", phone: "+44 7700 900234",
    linkedin: "linkedin.com/in/sana-w-ai", github: "github.com/sana-w",
    location: "London, UK",
    bio: "PhD in NLP, now bridging academia and product. Co-authored 3 papers on attention mechanisms. Open to applied research or research engineer roles.",
    projects: [
      { name: "AttentionViz", desc: "Visual debugger for transformer attention heads" },
      { name: "BenchmarkHub", desc: "Community LLM benchmark tracker" },
    ],
  },
  {
    id: "8", rank: 8, name: "Dev B.", role: "Backend AI Engineer", xp: 9200, level: 11,
    hasBuilderBadge: true, plan: "Pro",
    skills: ["FastAPI", "Redis", "Celery", "PostgreSQL", "Docker"],
    email: "dev.b@proton.me", phone: "+91 43210 98765",
    linkedin: "linkedin.com/in/dev-b-backend", github: "github.com/dev-b",
    location: "Pune, India",
    bio: "Backend engineer building high-throughput AI inference pipelines. Obsessed with latency and reliability. Looking for backend/infra roles at AI companies.",
    projects: [
      { name: "InferenceQueue", desc: "Async LLM request queue with priority lanes" },
      { name: "CacheLayer", desc: "Semantic caching for LLM API cost reduction" },
    ],
  },
  {
    id: "9", rank: 9, name: "Nisha J.", role: "AI Product Designer", xp: 8600, level: 11,
    hasBuilderBadge: false, plan: "Builder",
    skills: ["UI/UX", "Figma", "Prototyping", "User Research", "React"],
    email: "nisha.j@hey.com", phone: "+91 32109 87654",
    linkedin: "linkedin.com/in/nisha-j-design", github: "github.com/nisha-j",
    location: "Bangalore, India",
    bio: "Designing for AI products — turning complex models into calm, intuitive UIs. Seeking design lead roles at AI startups that care about craft.",
    projects: [
      { name: "CalmUI", desc: "Design system for AI product interfaces" },
      { name: "OnboardAI", desc: "Friction-free onboarding flows for LLM tools" },
    ],
  },
  {
    id: "10", rank: 10, name: "Yash G.", role: "ML Ops Engineer", xp: 8100, level: 10,
    hasBuilderBadge: true, plan: "Pro",
    skills: ["Docker", "K8s", "MLflow", "Terraform", "AWS"],
    email: "yash.g@gmail.com", phone: "+91 21098 76543",
    linkedin: "linkedin.com/in/yash-g-mlops", github: "github.com/yash-g",
    location: "Ahmedabad, India",
    bio: "MLOps engineer who keeps models running in production. Built CI/CD for 6 ML teams. Open to MLOps or platform engineering roles.",
    projects: [
      { name: "ModelDeploy", desc: "One-click model deployment to AWS + GCP" },
      { name: "DriftAlert", desc: "Real-time model performance monitoring" },
    ],
  },
];
