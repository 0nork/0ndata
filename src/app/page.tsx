import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "0n Apps — AI-Powered Applications Built on Your CRM",
  description:
    "The 0n Network delivers production-ready AI applications that run entirely on your CRM infrastructure. No external databases. No separate auth. Just install and go.",
  openGraph: {
    title: "0n Apps — AI-Powered CRM Applications",
    description:
      "Production-ready AI applications that run entirely on your CRM. Install from the marketplace and go.",
    url: "https://crm.web0n.com",
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
    tagline: "Your CRM Is Your Database",
    description:
      "Turn Custom Objects into database tables, Contacts into authenticated users, and get a full REST API. The backend you never have to build.",
    href: "/how-it-works",
    color: "cyan",
    status: "Live",
    price: "$9/mo",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
    features: [
      "Custom Objects as Tables",
      "Contact-based Auth",
      "REST API",
      "JWT Sessions",
      "Webhook Sync",
    ],
  },
  {
    name: "0n Course Builder",
    tagline: "AI-Powered Course Creation",
    description:
      "Define your topic, set the difficulty, choose how much AI does. From full auto-generation to light structure assistance. Courses built in minutes, not months.",
    href: "/apps/course-builder",
    color: "purple",
    status: "Live",
    price: "$19/mo",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    features: [
      "AI Content Generation",
      "Featured Image Generation",
      "Adjustable AI Level",
      "Content Upload",
      "CRM Membership Sync",
    ],
  },
];

const COMING_SOON = [
  {
    name: "0n Appointments",
    desc: "AI scheduling that books, reschedules, and follows up automatically.",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "0n Reputation",
    desc: "Automated review requests, response drafting, and sentiment tracking.",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    name: "0n Social",
    desc: "Multi-platform content scheduling, analytics, and AI caption writing.",
    icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
  },
  {
    name: "0n Pipeline",
    desc: "AI deal scoring, automated follow-ups, and revenue forecasting.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];

export default function HomePage() {
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
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            Marketplace
          </Link>
          <Link
            href="/how-it-works"
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            How It Works
          </Link>
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
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

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20 pb-24">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-gray-700 mb-6">
            POWERED BY THE 0n NETWORK
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            AI Applications That Run on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Your CRM
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            No external databases. No separate auth systems. No infrastructure
            to manage. Install an app from the marketplace and it runs on the
            CRM you already have.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/marketplace"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-medium transition"
            >
              Browse Apps
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg text-lg transition"
            >
              How It Works
            </Link>
          </div>
        </div>
      </header>

      {/* How the 0n Network Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            One Platform. Infinite Applications.
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            The 0n Network is an AI orchestration layer that turns your CRM into
            a full application platform. Every app installs in one click and
            uses your existing infrastructure.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Install from Marketplace",
                desc: "Browse the 0n app catalog. Click install. Authorize your CRM location. That's it — the app provisions itself automatically.",
                icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
              },
              {
                step: "2",
                title: "Runs on Your CRM",
                desc: "Custom Objects become databases. Contacts become users. Workflows become automation. Your CRM does what it was always meant to do.",
                icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
              },
              {
                step: "3",
                title: "AI Does the Heavy Lifting",
                desc: "Every 0n app is powered by AI that generates, predicts, or automates. You describe the outcome. The app builds the result.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-6 rounded-xl border border-gray-800 bg-gray-900/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon d={item.icon} className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="text-xs text-cyan-400 font-mono mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Architecture */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The Architecture Behind Every 0n App
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Every application in the 0n ecosystem shares the same foundation.
            Your CRM provides the infrastructure. 0n provides the intelligence.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Custom Objects = Database",
                desc: "Schema-driven data layer with full CRUD, filtering, pagination, and type-safe field definitions. No Postgres, no Firebase, no Supabase.",
                icon: "M3 10h18M3 14h18M3 18h18M3 6h18",
                color: "cyan",
              },
              {
                title: "Contacts = Users",
                desc: "Bcrypt password hashing, JWT sessions, httpOnly cookies. Every user is simultaneously a CRM Contact — ready for workflows.",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                color: "purple",
              },
              {
                title: "AI = Engine",
                desc: "535+ tools across 26 services. Content generation, image creation, predictions, analysis. Powered by the 0nMCP orchestration layer.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                color: "amber",
              },
              {
                title: "OAuth = Security",
                desc: "Standard OAuth 2.0 install flow with minimal scopes. Your data never leaves your CRM. Every app is transparent about what it accesses.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                color: "green",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-6 rounded-xl border border-${item.color}-500/20 bg-gray-900/50`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    d={item.icon}
                    className={`w-5 h-5 text-${item.color}-400`}
                  />
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Apps */}
      <section id="apps" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Available Applications
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Production-ready apps that install in one click and run on your CRM.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {APPS.map((app) => (
              <div
                key={app.name}
                className={`rounded-2xl border border-${app.color}-500/20 bg-gray-900/50 overflow-hidden hover:border-${app.color}-500/40 transition group`}
              >
                <div className={`px-8 pt-8 pb-6 bg-${app.color}-500/5`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-${app.color}-500/10 border border-${app.color}-500/20 flex items-center justify-center`}
                      >
                        <Icon
                          d={app.icon}
                          className={`w-6 h-6 text-${app.color}-400`}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{app.name}</h3>
                        <p className="text-xs text-gray-500">{app.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20`}
                      >
                        {app.status}
                      </span>
                      <span className="text-sm font-bold text-gray-300">
                        {app.price}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{app.description}</p>
                </div>
                <div className="px-8 py-6">
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
                  <Link
                    href={app.href}
                    className={`block w-full text-center px-6 py-3 rounded-lg bg-${app.color}-500 hover:bg-${app.color}-600 font-medium transition`}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            The 0n catalog is growing. Every app follows the same pattern: one
            install, runs on your CRM, powered by AI.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {COMING_SOON.map((app) => (
              <div
                key={app.name}
                className="p-5 rounded-xl border border-gray-800 bg-gray-900/50 opacity-70 hover:opacity-100 transition"
              >
                <Icon d={app.icon} className="w-6 h-6 text-gray-500 mb-3" />
                <h3 className="text-sm font-bold mb-1">{app.name}</h3>
                <p className="text-xs text-gray-500">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "535+", label: "AI Tools Available" },
              { value: "26", label: "Integrated Services" },
              { value: "$0", label: "Infrastructure Cost" },
              { value: "1-Click", label: "Install" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built By */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Built by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              RocketOpp
            </span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            The 0n Network is created by RocketOpp LLC — builders of AI
            orchestration infrastructure powering 535+ tools across 26 services.
            We don&apos;t just build apps on the CRM. We build the
            infrastructure that makes apps on the CRM possible.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/marketplace"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-medium transition"
            >
              Browse the Marketplace
            </Link>
            <a
              href="mailto:mike@rocketopp.com"
              className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg text-lg transition"
            >
              Contact Us
            </a>
          </div>
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
            <Link href="/marketplace" className="hover:text-gray-300 transition">
              Marketplace
            </Link>
            <Link href="/how-it-works" className="hover:text-gray-300 transition">
              How It Works
            </Link>
            <Link href="/dashboard" className="hover:text-gray-300 transition">
              Dashboard
            </Link>
            <Link href="/settings" className="hover:text-gray-300 transition">
              Settings
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
