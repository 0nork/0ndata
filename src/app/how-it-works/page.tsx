import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "How 0nData Works — Turn Your CRM Into a Full Application Backend",
  description:
    "Learn how 0nData transforms CRM Custom Objects into database tables, Contacts into authenticated users, and delivers a production-ready REST API. No external databases needed.",
  keywords: [
    "CRM backend",
    "custom objects database",
    "contact authentication",
    "REST API CRM",
    "CRM application platform",
    "no-code backend",
    "JWT authentication CRM",
    "CRM developer tools",
    "CRM SaaS builder",
    "custom objects API",
    "CRM automation",
    "AI prediction engine",
  ],
  openGraph: {
    title: "How 0nData Works — Your CRM Is Now Your Database",
    description:
      "Custom Objects as tables. Contacts as users. Built-in auth. Zero external databases. Ship your app in days.",
    url: "https://crm.web0n.com/how-it-works",
    siteName: "0nData",
    type: "website",
  },
};

/* ── Reusable icon paths ─────────────────────────────────────── */

const icons = {
  database:
    "M3 10h18M3 14h18M3 18h18M3 6h18",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  api: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  check: "M5 13l4 4L19 7",
  arrow: "M13 7l5 5m0 0l-5 5m5-5H6",
  zap: "M13 10V3L4 14h7v7l9-11h-7z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  globe:
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  chart:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  refresh:
    "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  stack:
    "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
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

/* ── Page ─────────────────────────────────────────────────────── */

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-800/50">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-cyan-400">0n</span>Data
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/how-it-works"
            className="text-sm text-cyan-400 font-medium"
          >
            How It Works
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20 pb-16">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
            CRM APPLICATION BACKEND
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              0nData
            </span>{" "}
            Turns Your CRM Into a Full Application Backend
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Stop paying for external databases. Stop managing separate auth
            systems. Stop building REST APIs from scratch. Your CRM already has
            everything you need.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/api/marketplace/install"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-medium transition"
            >
              Install from Marketplace
            </Link>
            <a
              href="#the-problem"
              className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg text-lg transition"
            >
              Read More
            </a>
          </div>
        </div>
      </header>

      {/* ── The Problem ──────────────────────────────────────── */}
      <section id="the-problem" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            The Problem Every Builder Faces
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Every time you build a new tool, dashboard, or client-facing app,
            you face the same stack of decisions.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "Where do I store the data?",
                options: "Postgres? Firebase? Supabase? Airtable?",
              },
              {
                q: "How do I authenticate users?",
                options: "Auth0? Clerk? Custom JWT?",
              },
              {
                q: "How do I expose an API?",
                options: "Express? Next.js routes? Lambda?",
              },
              {
                q: "How do I keep it all in sync with my CRM?",
                options: "Zapier? Webhooks? Manual exports?",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="p-5 rounded-xl border border-red-500/20 bg-red-500/5"
              >
                <p className="font-semibold text-white mb-1">{item.q}</p>
                <p className="text-sm text-red-400/80">{item.options}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-center">
            <p className="text-lg font-semibold text-cyan-400">
              That&apos;s 4 systems to configure, 4 bills to pay, and 4 things
              that can break.
            </p>
            <p className="text-gray-400 mt-2">
              For every single project. 0nData eliminates all of it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ─────────────────────────────────────── */}
      <section
        id="four-pillars"
        className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works: Four Core Pillars
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            0nData replaces your entire backend stack with infrastructure your
            CRM already provides. Here&apos;s the architecture.
          </p>

          {/* Pillar 1 — Custom Objects as Tables */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                <Icon d={icons.database} />
              </div>
              <div>
                <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest">
                  Pillar 1
                </span>
                <h3 className="text-2xl font-bold">
                  Custom Objects as Database Tables
                </h3>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-3xl">
              Your CRM already has Custom Objects — a flexible, schema-driven
              data layer. 0nData treats them as first-class database tables with
              full CRUD operations, filtering, pagination, and sorting. Define
              your schema once and 0nData creates it automatically on install.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Supported Field Types",
                  desc: "Text, Number, Date, Boolean, Object, Array — all native CRM data types.",
                },
                {
                  title: "Schema Versioning",
                  desc: "Fields are added without breaking existing data. Schemas evolve safely over time.",
                },
                {
                  title: "Idempotent Installation",
                  desc: "Reinstall safely without duplicating schemas. 0nData checks before creating.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg border border-gray-800 bg-gray-900/50"
                >
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 2 — Contacts as Users */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 shrink-0">
                <Icon d={icons.user} className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <span className="text-xs text-purple-400 font-mono uppercase tracking-widest">
                  Pillar 2
                </span>
                <h3 className="text-2xl font-bold">
                  Contacts as Authenticated Users
                </h3>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-3xl">
              Why build a separate user database? Your CRM Contacts ARE your
              users. 0nData adds a secure password hash to a custom field on
              each Contact, enabling full authentication without a separate
              identity provider.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Email + password signup and signin",
                "Bcrypt password hashing (12 salt rounds)",
                "JWT session tokens (24-hour expiry, httpOnly cookies)",
                "User profile from Contact fields (name, email, phone, tags)",
                "Works alongside existing Contact workflows and automations",
                "Every signup is a CRM Contact — ready for nurture sequences",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 py-2">
                  <Icon
                    d={icons.check}
                    className="w-5 h-5 text-purple-400 shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 3 — REST API */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 shrink-0">
                <Icon d={icons.api} className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <span className="text-xs text-green-400 font-mono uppercase tracking-widest">
                  Pillar 3
                </span>
                <h3 className="text-2xl font-bold">
                  Production-Ready REST API
                </h3>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-3xl">
              Every Custom Object schema gets a complete REST API instantly.
              Connect any frontend framework — React, Next.js, Vue, mobile apps
              — to your CRM data through clean, documented endpoints.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/80">
                    <th className="px-4 py-3 text-left text-xs font-mono text-green-400">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-gray-400">
                      Endpoint
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-400">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {[
                    {
                      method: "GET",
                      path: "/api/v1/{schema}",
                      desc: "List records with filters and pagination",
                    },
                    {
                      method: "POST",
                      path: "/api/v1/{schema}",
                      desc: "Create a new record",
                    },
                    {
                      method: "GET",
                      path: "/api/v1/{schema}/{id}",
                      desc: "Get a single record by ID",
                    },
                    {
                      method: "PUT",
                      path: "/api/v1/{schema}/{id}",
                      desc: "Update an existing record",
                    },
                    {
                      method: "DELETE",
                      path: "/api/v1/{schema}/{id}",
                      desc: "Delete a record",
                    },
                  ].map((row) => (
                    <tr key={row.path + row.method} className="bg-gray-900/30">
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            row.method === "GET"
                              ? "bg-blue-500/10 text-blue-400"
                              : row.method === "POST"
                                ? "bg-green-500/10 text-green-400"
                                : row.method === "PUT"
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {row.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-300">
                        {row.path}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              All endpoints are JWT-protected, rate-limited, and include
              automatic usage tracking.
            </p>
          </div>

          {/* Pillar 4 — Automatic Installation */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                <Icon d={icons.zap} className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xs text-amber-400 font-mono uppercase tracking-widest">
                  Pillar 4
                </span>
                <h3 className="text-2xl font-bold">
                  Automatic Schema Installation
                </h3>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-3xl">
              When a user installs 0nData from the Marketplace, everything is
              created automatically. No manual setup. No configuration files. No
              terminal commands.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              {[
                {
                  step: "1",
                  title: "Click Install",
                  desc: "User clicks Install on the CRM Marketplace and selects their location.",
                },
                {
                  step: "2",
                  title: "Authorize",
                  desc: "OAuth flow grants 0nData access to Custom Objects, Contacts, and Custom Fields.",
                },
                {
                  step: "3",
                  title: "Schemas Created",
                  desc: "All Custom Object schemas are automatically created in the user's CRM location.",
                },
                {
                  step: "4",
                  title: "Ready to Go",
                  desc: "Dashboard loads, API is live, cron cycles begin. Zero configuration needed.",
                },
              ].map((item, i) => (
                <div key={item.step} className="flex-1 relative">
                  <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/50 h-full">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center mb-3">
                      {item.step}
                    </div>
                    <h4 className="font-semibold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <Icon
                        d={icons.arrow}
                        className="w-5 h-5 text-gray-600"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Showcase: JAX ────────────────────────────────────── */}
      <section id="showcase" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
              LIVE SHOWCASE APPLICATION
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              JAX Crypto Prediction Engine
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A fully autonomous AI that predicts crypto prices every 15
              minutes, tracks its own accuracy, and unlocks new capabilities as
              the community grows. Built entirely on 0nData — zero external
              databases.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* What JAX Does */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon d={icons.chart} className="w-5 h-5 text-cyan-400" />
                What JAX Does
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  "Predicts BTC and ETH price direction every 15 minutes",
                  "Tracks accuracy with verified win/loss records in Custom Objects",
                  "52-unlock progression system restores prediction tools over time",
                  "Generates AI-written market commentary after each cycle",
                  "Displays everything on a real-time dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon
                      d={icons.check}
                      className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What JAX Proves */}
            <div className="p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon d={icons.zap} className="w-5 h-5 text-amber-400" />
                What JAX Proves
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  "Real-time data pipelines running on Custom Objects",
                  "Automated scheduling — 96 prediction cycles per day",
                  "Complex data relationships across 5 interconnected schemas",
                  "Contact-based user authentication in production",
                  "Rate-limited public API serving a live frontend",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon
                      d={icons.check}
                      className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Schema table */}
          <h3 className="text-xl font-bold mb-4 text-center">
            5 Custom Object Schemas Installed Automatically
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="px-4 py-3 text-left text-xs font-mono text-cyan-400">
                    Schema
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">
                    Key Fields
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {[
                  {
                    key: "predictions",
                    purpose: "Individual crypto price predictions",
                    fields:
                      "direction, confidence, entry_price, target_price, result, verified_at",
                  },
                  {
                    key: "prediction_stats",
                    purpose: "Daily aggregated accuracy tracking",
                    fields:
                      "win_rate, total_predictions, wins, losses, streak, interval",
                  },
                  {
                    key: "jax_unlocks",
                    purpose: "Milestone achievements and progression",
                    fields:
                      "unlock_id, unlocked_at, triggered_by, notification_sent",
                  },
                  {
                    key: "jax_sentences",
                    purpose: "AI-generated market commentary",
                    fields: "text, cycle_number, models_used, emotion, context",
                  },
                  {
                    key: "jax_social_stats",
                    purpose: "Social media engagement metrics",
                    fields: "followers, total_likes, total_retweets, date",
                  },
                ].map((row) => (
                  <tr key={row.key} className="bg-gray-900/30">
                    <td className="px-4 py-3 font-mono text-cyan-300">
                      {row.key}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{row.purpose}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {row.fields}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            If a crypto prediction engine can run on this stack, your client
            portal, booking system, or SaaS tool can too.
          </p>
        </div>
      </section>

      {/* ── Use Cases ────────────────────────────────────────── */}
      <section
        id="use-cases"
        className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What You Can Build With 0nData
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            The CRM-as-backend pattern works for any application. Here are the
            most popular use cases.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: icons.globe,
                title: "Client Portals",
                desc: "Branded portals where clients log in as Contacts, view project data from Custom Objects, and interact with your team. No separate database.",
                color: "cyan",
              },
              {
                icon: icons.refresh,
                title: "Booking & Appointment Systems",
                desc: "Store availability, reservations, and service records in Custom Objects. Authenticate staff and customers through Contacts.",
                color: "purple",
              },
              {
                icon: icons.chart,
                title: "Analytics Dashboards",
                desc: "Aggregate CRM data into summary tables. Build dashboards that pull from the REST API. Schedule automated data rollups.",
                color: "green",
              },
              {
                icon: icons.stack,
                title: "Internal Tools",
                desc: "Admin panels, inventory trackers, approval workflows. Your team authenticates with Contact profiles. Data lives alongside your CRM.",
                color: "amber",
              },
              {
                icon: icons.zap,
                title: "SaaS Applications",
                desc: "Launch micro-SaaS products using your CRM as the entire backend. User management, data storage, API access, billing — one platform.",
                color: "blue",
              },
              {
                icon: icons.shield,
                title: "E-Commerce Extensions",
                desc: "Product catalogs, order tracking, customer reviews, loyalty programs. All stored in Custom Objects, all accessible via API.",
                color: "red",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-6 rounded-xl border bg-gray-900/50 hover:bg-gray-900/80 transition border-${item.color}-500/20`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center mb-4`}
                >
                  <Icon
                    d={item.icon}
                    className={`w-5 h-5 text-${item.color}-400`}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical Specs ──────────────────────────────────── */}
      <section id="technical-specs" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Technical Specifications
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Built for developers. Production-grade from day one.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Auth Spec */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon d={icons.lock} className="w-5 h-5 text-purple-400" />
                Authentication
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Bcrypt password hashing (12 salt rounds)</li>
                <li>
                  JWT sessions via{" "}
                  <code className="text-purple-300 bg-purple-500/10 px-1 rounded">
                    jose
                  </code>{" "}
                  library (Edge Runtime compatible)
                </li>
                <li>httpOnly secure cookies with 24-hour expiry</li>
                <li>Automatic session refresh before expiration</li>
                <li>
                  Protected and public route configuration via middleware
                </li>
              </ul>
            </div>

            {/* API Spec */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon d={icons.api} className="w-5 h-5 text-green-400" />
                API Layer
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>RESTful CRUD endpoints for every registered schema</li>
                <li>Token bucket rate limiting (100 req / 10-second burst)</li>
                <li>Daily usage cap tracking (200,000 calls/day)</li>
                <li>Exponential backoff on upstream rate limits</li>
                <li>JSON request/response with structured error handling</li>
              </ul>
            </div>

            {/* Data Layer Spec */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon d={icons.database} className="w-5 h-5 text-cyan-400" />
                Data Layer
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>ORM-style Model class mapping to Custom Object schemas</li>
                <li>
                  Chainable query builder:{" "}
                  <code className="text-cyan-300 bg-cyan-500/10 px-1 rounded">
                    where().orderBy().limit().execute()
                  </code>
                </li>
                <li>Automatic field mapping (camelCase to snake_case)</li>
                <li>Cursor-based pagination for large datasets</li>
                <li>Schema registry with type-safe field definitions</li>
              </ul>
            </div>

            {/* OAuth Spec */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon d={icons.shield} className="w-5 h-5 text-amber-400" />
                OAuth &amp; Webhooks
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Standard OAuth 2.0 authorization code flow</li>
                <li>Automatic token refresh with 5-minute expiry buffer</li>
                <li>CSRF protection via state parameter</li>
                <li>
                  Scoped access: Contacts, Custom Objects, Locations, Custom
                  Fields
                </li>
                <li>Webhook receiver with signature verification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Gets Installed ───────────────────────────────── */}
      <section
        id="installation"
        className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What Gets Installed in Your CRM
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            When you install 0nData, the following is automatically created in
            your sub-account. Nothing is stored externally.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-cyan-500/20 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-1 text-cyan-400">
                5 Custom Object Schemas
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Automatically created
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="font-mono text-xs">predictions</li>
                <li className="font-mono text-xs">prediction_stats</li>
                <li className="font-mono text-xs">jax_unlocks</li>
                <li className="font-mono text-xs">jax_sentences</li>
                <li className="font-mono text-xs">jax_social_stats</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-purple-500/20 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-1 text-purple-400">
                1 Custom Field
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Added to Contact model
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <span className="font-mono text-xs text-purple-300">
                    0nData Password Hash
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    Encrypted field for secure user authentication
                  </span>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-amber-500/20 bg-gray-900/50">
              <h3 className="text-lg font-bold mb-1 text-amber-400">
                3 Webhook Subscriptions
              </h3>
              <p className="text-xs text-gray-500 mb-4">Real-time sync</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="font-mono text-xs">contact.created</li>
                <li className="font-mono text-xs">contact.updated</li>
                <li className="font-mono text-xs">contact.deleted</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Permissions ──────────────────────────────────────── */}
      <section id="permissions" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Required Permissions
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8">
            0nData requests the minimum scopes needed to operate. All data stays
            in YOUR CRM.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="px-4 py-3 text-left text-xs font-mono text-gray-400">
                    Scope
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">
                    Why It&apos;s Needed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {[
                  {
                    scope: "contacts.readonly",
                    why: "Read Contact profiles for user authentication lookups",
                  },
                  {
                    scope: "contacts.write",
                    why: "Create and update Contacts during user signup",
                  },
                  {
                    scope: "objects/schema.readonly",
                    why: "Check if Custom Object schemas already exist before creating",
                  },
                  {
                    scope: "objects/schema.write",
                    why: "Create and update Custom Object schemas on install",
                  },
                  {
                    scope: "objects/record.readonly",
                    why: "Read Custom Object records via the REST API",
                  },
                  {
                    scope: "objects/record.write",
                    why: "Create, update, and delete records via the REST API",
                  },
                  {
                    scope: "locations.readonly",
                    why: "Read location configuration for multi-tenant support",
                  },
                  {
                    scope: "locations/customFields.readonly",
                    why: "Read custom field definitions for authentication setup",
                  },
                  {
                    scope: "locations/customFields.write",
                    why: "Create the password hash custom field on Contacts",
                  },
                ].map((row) => (
                  <tr key={row.scope} className="bg-gray-900/30">
                    <td className="px-4 py-3 font-mono text-cyan-300 text-xs whitespace-nowrap">
                      {row.scope}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            0nData does not export, copy, or store your data externally. Your
            Custom Objects and Contacts remain fully under your control.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section
        id="faq"
        className="py-20 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Do I need an external database?",
                a: "No. 0nData uses your CRM's built-in Custom Objects as the data layer. No Postgres, Firebase, Supabase, or any other database needed.",
              },
              {
                q: "How does user authentication work?",
                a: "Users sign up with email and password. The password is hashed with bcrypt and stored as a custom field on their CRM Contact record. Login verifies the hash and issues a JWT session cookie. Every user is simultaneously a CRM Contact.",
              },
              {
                q: "Can I use 0nData for my own apps, not just JAX?",
                a: "Absolutely. JAX is the showcase app, but the underlying infrastructure — Custom Objects as tables, Contacts as users, REST API — works for any application. Client portals, booking systems, dashboards, SaaS tools, and more.",
              },
              {
                q: "What happens to my data if I uninstall?",
                a: "Your Custom Object schemas and records stay in your CRM. 0nData doesn't store anything externally. Uninstalling simply disconnects the API layer — your data remains untouched.",
              },
              {
                q: "Is there a rate limit on the API?",
                a: "Yes. The API uses token bucket rate limiting (100 requests per 10-second burst) with a daily cap of 200,000 calls. Requests that exceed limits receive a 429 response with retry-after headers.",
              },
              {
                q: "How much does it cost?",
                a: "$9/month base, which includes 1,000 API calls. Additional API calls are $0.01 each. No contracts, no setup fees, cancel anytime.",
              },
              {
                q: "Does 0nData work with my existing CRM workflows?",
                a: "Yes. Since users are CRM Contacts and data lives in Custom Objects, everything integrates natively with your existing automations, workflows, pipelines, and communication tools.",
              },
              {
                q: "Who built 0nData?",
                a: "0nData is built by RocketOpp LLC, creators of the 0n Network — an AI orchestration infrastructure powering 535+ tools across 26 integrated services. The same technology powers 0nMCP, 0n Marketplace, and the Rocket+ suite.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="p-5 rounded-xl border border-gray-800 bg-gray-900/50"
              >
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Turn Your CRM Into a Backend?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            One install. Zero external dependencies. Your CRM does the heavy
            lifting. Ship your next app in days, not months.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/api/marketplace/install"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-medium transition"
            >
              Install from Marketplace
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg text-lg transition"
            >
              Try the Demo
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-6">
            $9/month + $0.01 per API call | No contracts | Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            <span className="text-cyan-400 font-bold">0n</span>Data by
            RocketOpp LLC
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gray-300 transition">
              Home
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-gray-300 transition"
            >
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
