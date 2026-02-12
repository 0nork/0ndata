import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20" />
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold">
            <span className="text-cyan-400">0n</span>Data
          </div>
          <div className="flex gap-4">
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

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20 pb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your CRM is now your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              database
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Custom Objects as Tables. Contacts as Users. Built-in Auth.
            Zero infrastructure. Ship your app in days, not months.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/api/marketplace/install"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-medium transition"
            >
              Install from CRM Marketplace
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg text-lg transition"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything you need, nothing you don&apos;t
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Custom Objects = Tables",
              desc: "Define schemas, create records, query with filters. Your CRM Custom Objects become a full database layer.",
              icon: "M3 10h18M3 14h18M3 18h18M3 6h18",
            },
            {
              title: "Contacts = Users",
              desc: "Sign up, log in, manage sessions. CRM Contacts become authenticated application users with bcrypt passwords.",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            },
            {
              title: "Built-in Everything",
              desc: "OAuth, JWT sessions, rate limiting, usage tracking, webhooks. No external services needed.",
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-cyan-800/50 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JAX Demo Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
            FIRST APP
          </div>
          <h2 className="text-3xl font-bold mb-4">
            JAX Crypto Prediction Engine
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            An AI that predicts crypto prices, earns unlocks, and grows
            autonomously. Built entirely on 0nData — zero external databases.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Predictions", value: "5 schemas" },
              { label: "Users", value: "CRM contacts" },
              { label: "Unlocks", value: "52 milestones" },
              { label: "Infra cost", value: "$0" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg bg-gray-900/80 border border-gray-800"
              >
                <div className="text-2xl font-bold text-cyan-400">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="max-w-sm mx-auto p-8 rounded-xl border border-cyan-500/30 bg-gray-900/50">
          <div className="text-center">
            <div className="text-4xl font-bold">
              $9<span className="text-lg text-gray-400">/month</span>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              + $0.01 per API call
            </div>
          </div>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Unlimited schemas",
              "Unlimited records",
              "Contact-as-User auth",
              "JWT sessions",
              "Rate limiting",
              "Usage tracking",
              "Webhook support",
              "REST API",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-cyan-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/api/marketplace/install"
            className="block w-full mt-8 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-center font-medium transition"
          >
            Install Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <div>
            <span className="text-cyan-400 font-bold">0n</span>Data by
            RocketOpp LLC
          </div>
          <div className="flex gap-6">
            <Link href="/settings" className="hover:text-gray-300 transition">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
