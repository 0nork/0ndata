import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "0n Marketplace — AI-Powered CRM Applications",
  description:
    "Browse and install AI-powered applications that run entirely on your CRM. No external databases, no separate auth, no infrastructure to manage.",
  openGraph: {
    title: "0n Marketplace — CRM App Store",
    description:
      "AI-powered applications that install in one click and run on your CRM.",
    url: "https://crm.web0n.com/marketplace",
    siteName: "0n Apps",
    type: "website",
  },
};

function Icon({
  d,
  className = "w-6 h-6 text-cyan-400",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={d}
      />
    </svg>
  );
}

const APPS = [
  {
    name: "0nData",
    tagline: "CRM Application Backend",
    description:
      "Turn your CRM into a full application backend. Custom Objects become database tables. Contacts become authenticated users. A production-ready REST API connects it all.",
    longDesc:
      "0nData eliminates the need for external databases, separate authentication systems, and custom API layers. Install it and your CRM becomes a complete backend for any application — client portals, dashboards, SaaS tools, and more.",
    href: "/how-it-works",
    installHref: "/api/marketplace/install",
    color: "cyan",
    status: "Live",
    price: "$9/mo",
    priceSub: "+ $0.01/API call",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
    features: [
      "Custom Objects as Database Tables",
      "Contact-Based JWT Authentication",
      "Full REST API (CRUD + Filtering)",
      "Automatic Schema Installation",
      "Rate Limiting & Usage Tracking",
      "OAuth 2.0 Marketplace Install",
      "Webhook Event Sync",
      "ORM-Style Query Builder",
    ],
    schemas: [
      "predictions",
      "prediction_stats",
      "jax_unlocks",
      "jax_sentences",
      "jax_social_stats",
    ],
    category: "Developer Tools",
  },
  {
    name: "0n Course Builder",
    tagline: "AI-Powered Course Creation",
    description:
      "Create professional courses in minutes. Define the topic, set the difficulty, choose your AI level. From full auto-generation to minimal structure assistance.",
    longDesc:
      "Stop spending weeks building course content. Tell the AI what you want to teach, how deep to go, and how much help you need. Upload your own materials or let AI generate everything — including featured images for every section.",
    href: "/apps/course-builder",
    installHref: "/apps/course-builder",
    color: "purple",
    status: "Live",
    price: "$19/mo",
    priceSub: "Unlimited courses",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    features: [
      "AI Content Generation (Extensive to Minimal)",
      "Featured Image Generation Per Section",
      "Content Upload (Any Amount, No Minimum)",
      "Difficulty Level Configuration",
      "Course Structure Auto-Builder",
      "Section-by-Section AI Editing",
      "CRM Membership Product Sync",
      "Export to Multiple Formats",
    ],
    schemas: [
      "courses",
      "course_sections",
      "course_media",
      "course_enrollments",
    ],
    category: "Content & Education",
  },
];

const COMING_SOON = [
  {
    name: "0n Appointments",
    desc: "AI scheduling that books, reschedules, and follows up without human intervention. Integrated with your CRM calendar.",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    category: "Scheduling",
  },
  {
    name: "0n Reputation",
    desc: "Automated review collection, AI response drafting, and real-time sentiment analysis across Google, Yelp, and Facebook.",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    category: "Marketing",
  },
  {
    name: "0n Social",
    desc: "Multi-platform content scheduling, AI caption writing, hashtag optimization, and engagement analytics dashboard.",
    icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
    category: "Social Media",
  },
  {
    name: "0n Pipeline",
    desc: "AI-powered deal scoring, automated follow-up sequences, revenue forecasting, and win probability predictions.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    category: "Sales",
  },
  {
    name: "0n Forms",
    desc: "Intelligent multi-step forms with conditional logic, AI field suggestions, and automatic CRM field mapping.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    category: "Lead Generation",
  },
  {
    name: "0n Reports",
    desc: "Automated reporting with AI-generated insights, custom dashboards, and scheduled PDF/email delivery.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    category: "Analytics",
  },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-800/50">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-cyan-400">0n</span>
          <span className="text-gray-400 text-lg ml-1">Apps</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/marketplace"
            className="text-sm text-cyan-400 font-medium"
          >
            Marketplace
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 rounded-lg transition font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-cyan-400">0n</span> Marketplace
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          AI-powered applications that install in one click and run entirely on
          your CRM. No external infrastructure required.
        </p>
      </header>

      {/* Live Apps */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6">
            Available Now
          </h2>
          <div className="space-y-8">
            {APPS.map((app) => (
              <div
                key={app.name}
                className={`rounded-2xl border border-${app.color}-500/20 bg-gray-900/50 overflow-hidden`}
              >
                <div className="grid md:grid-cols-3">
                  {/* Left — Info */}
                  <div className="md:col-span-2 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-${app.color}-500/10 border border-${app.color}-500/20 flex items-center justify-center`}
                      >
                        <Icon
                          d={app.icon}
                          className={`w-7 h-7 text-${app.color}-400`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold">{app.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{app.tagline}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{app.description}</p>
                    <p className="text-sm text-gray-500 mb-6">{app.longDesc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {app.features.map((f) => (
                        <span
                          key={f}
                          className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-gray-800"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-800">
                        {app.category}
                      </span>
                      <span>|</span>
                      <span>
                        Schemas: {app.schemas.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Right — Pricing + CTA */}
                  <div
                    className={`p-8 bg-${app.color}-500/5 border-t md:border-t-0 md:border-l border-${app.color}-500/10 flex flex-col justify-center`}
                  >
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold">{app.price}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {app.priceSub}
                      </div>
                    </div>
                    <Link
                      href={app.installHref}
                      className={`block w-full text-center px-6 py-3 rounded-lg bg-${app.color}-500 hover:bg-${app.color}-600 font-medium transition mb-3`}
                    >
                      Install App
                    </Link>
                    <Link
                      href={app.href}
                      className="block w-full text-center px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500 text-sm transition"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6">
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {COMING_SOON.map((app) => (
              <div
                key={app.name}
                className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 opacity-60 hover:opacity-100 transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon d={app.icon} className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{app.name}</h3>
                    <span className="text-[10px] text-gray-600">
                      {app.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Build Your Own 0n App
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            The 0n platform is open for developers. Build applications that run
            on CRM infrastructure, powered by 535+ AI tools. Join the network.
          </p>
          <a
            href="mailto:mike@rocketopp.com"
            className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-medium transition"
          >
            Contact Us to Build
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            <span className="text-cyan-400 font-bold">0n</span> Apps by
            RocketOpp LLC
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gray-300 transition">
              Home
            </Link>
            <Link
              href="/marketplace"
              className="hover:text-gray-300 transition"
            >
              Marketplace
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-gray-300 transition"
            >
              How It Works
            </Link>
            <a
              href="mailto:mike@rocketopp.com"
              className="hover:text-gray-300 transition"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
