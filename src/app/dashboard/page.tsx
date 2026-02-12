"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Stats {
  winRate: number;
  totalPredictions: number;
  wins: number;
  losses: number;
  currentStreak: number;
}

interface Prediction {
  id: string;
  coin: string;
  direction: string;
  confidence: number;
  result: string;
  entryPrice: number;
  targetPrice: number;
}

interface UnlockItem {
  id: string;
  name: string;
  unlocked: boolean;
  progress: number;
  act: number;
}

interface UnlocksData {
  catalog: UnlockItem[];
  unlocked: number;
  total: number;
  progress: number;
}

interface Sentence {
  id: string;
  text: string;
  emotion: string;
  cycleNumber: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [unlocks, setUnlocks] = useState<UnlocksData | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, predsRes, unlocksRes, sentRes] = await Promise.all([
          fetch("/api/jax/stats"),
          fetch("/api/jax/predictions?limit=5"),
          fetch("/api/jax/unlocks"),
          fetch("/api/jax/sentences?limit=5"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (predsRes.ok) {
          const d = await predsRes.json();
          setPredictions(d.predictions || []);
        }
        if (unlocksRes.ok) setUnlocks(await unlocksRes.json());
        if (sentRes.ok) {
          const d = await sentRes.json();
          setSentences(d.sentences || []);
        }
      } catch {
        // Data may not be available yet
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSignout() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          <span className="text-cyan-400">0n</span>Data
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/settings"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Settings
          </Link>
          <button
            onClick={handleSignout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">JAX Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-300">
                Prediction Stats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  {
                    label: "Win Rate",
                    value: `${stats?.winRate || 0}%`,
                    color: "text-cyan-400",
                  },
                  {
                    label: "Total",
                    value: String(stats?.totalPredictions || 0),
                    color: "text-white",
                  },
                  {
                    label: "Wins",
                    value: String(stats?.wins || 0),
                    color: "text-green-400",
                  },
                  {
                    label: "Losses",
                    value: String(stats?.losses || 0),
                    color: "text-red-400",
                  },
                  {
                    label: "Streak",
                    value: String(stats?.currentStreak || 0),
                    color: "text-yellow-400",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded-lg bg-gray-900/80 border border-gray-800"
                  >
                    <div className={`text-2xl font-bold ${s.color}`}>
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Predictions */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-300">
                Recent Predictions
              </h2>
              {predictions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No predictions yet. Data will appear once JAX starts
                  predicting.
                </p>
              ) : (
                <div className="space-y-2">
                  {predictions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium">
                          {p.coin}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            p.direction === "UP"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {p.direction}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          {p.confidence}% conf
                        </span>
                        <span
                          className={`font-medium ${
                            p.result === "WIN"
                              ? "text-green-400"
                              : p.result === "LOSS"
                                ? "text-red-400"
                                : "text-gray-400"
                          }`}
                        >
                          {p.result || "PENDING"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Unlock Progress */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-300">
                Unlock Progress
              </h2>
              {unlocks ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${unlocks.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">
                      {unlocks.unlocked}/{unlocks.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {unlocks.catalog.slice(0, 8).map((u) => (
                      <div
                        key={u.id}
                        className={`p-3 rounded-lg border text-sm ${
                          u.unlocked
                            ? "border-cyan-500/30 bg-cyan-500/5"
                            : "border-gray-800 bg-gray-900/30"
                        }`}
                      >
                        <div className="font-medium truncate">{u.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {u.unlocked
                            ? "Unlocked"
                            : `${Math.round(u.progress)}%`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Loading unlocks...</p>
              )}
            </section>

            {/* Recent Sentences */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-300">
                Recent JAX Sentences
              </h2>
              {sentences.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No sentences earned yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {sentences.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                    >
                      <p className="text-sm italic text-gray-300">
                        &ldquo;{s.text}&rdquo;
                      </p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-500">
                        {s.emotion && <span>{s.emotion}</span>}
                        {s.cycleNumber > 0 && (
                          <span>Cycle #{s.cycleNumber}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
