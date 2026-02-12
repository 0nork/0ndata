"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SchemaInfo {
  key: string;
  name: string;
  status: string;
}

export default function SettingsPage() {
  const [installed, setInstalled] = useState(false);
  const [schemas] = useState<SchemaInfo[]>([
    { key: "predictions", name: "Predictions", status: "active" },
    { key: "prediction_stats", name: "Prediction Stats", status: "active" },
    { key: "jax_unlocks", name: "JAX Unlocks", status: "active" },
    { key: "jax_sentences", name: "JAX Sentences", status: "active" },
    { key: "jax_social_stats", name: "JAX Social Stats", status: "active" },
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("installed") === "true") {
      setInstalled(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 max-w-4xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          <span className="text-cyan-400">0n</span>Data
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        {installed && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
            Successfully installed! CRM schemas have been created for your
            location.
          </div>
        )}

        {/* Connection Status */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            Connection Status
          </h2>
          <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm">Connected to CRM</span>
            </div>
          </div>
        </section>

        {/* Installed Schemas */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            Installed Schemas
          </h2>
          <div className="space-y-2">
            {schemas.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-gray-900/50"
              >
                <div>
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({s.key})</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Usage */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            API Usage
          </h2>
          <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
            <div className="text-sm text-gray-400">
              Usage tracking is active. API calls are metered at $0.01 per call.
            </div>
          </div>
        </section>

        {/* Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Actions</h2>
          <div className="flex gap-3">
            <Link
              href="/api/marketplace/install"
              className="px-4 py-2 text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition"
            >
              Reinstall Schemas
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
