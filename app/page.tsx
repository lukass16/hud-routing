"use client";

import { useState, useEffect, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import ScenarioCard from "@/components/ScenarioCard";
import CategoryFilter from "@/components/CategoryFilter";
import { ScenarioEntry, SearchResult } from "@/lib/types";

export default function Home() {
  const [scenarios, setScenarios] = useState<ScenarioEntry[]>([]);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [refinedQuery, setRefinedQuery] = useState<string | null>(null);
  const [showRefinedQuery, setShowRefinedQuery] = useState(false);
  const [useQueryExpansion, setUseQueryExpansion] = useState(true);

  useEffect(() => {
    fetch("/api/scenarios")
      .then((res) => res.json())
      .then((data) => setScenarios(data.scenarios))
      .catch(console.error);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    scenarios.forEach((s) => {
      if (s.metadata?.category) cats.add(s.metadata.category);
    });
    return Array.from(cats).sort();
  }, [scenarios]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setResults(null);
      setHasSearched(false);
      setRefinedQuery(null);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setRefinedQuery(null);
    setShowRefinedQuery(false);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, refine: useQueryExpansion }),
      });
      const data = await res.json();
      setResults(data.results);
      setRefinedQuery(data.refinedQuery ?? null);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayItems: SearchResult[] = useMemo(() => {
    const items = results
      ? results
      : scenarios.map((s) => ({ ...s, score: 0 }));

    if (selectedCategory) {
      return items.filter(
        (item) => item.metadata?.category === selectedCategory
      );
    }
    return items;
  }, [results, scenarios, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center relative">
          <a href="/" className="group/logo" aria-label="HUD home">
            <svg width="80" height="30" viewBox="140 320 750 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
              <defs>
                <mask id="textMask">
                  <path d="M153.488 660.583V634.232H177.478V386.173L147.604 372.544V353.917L232.247 332.109H248.995V476.129L249.9 476.583C269.364 451.141 291.543 432.06 324.586 432.06C362.608 432.06 388.408 461.136 388.408 506.568V634.232H408.325V660.583H298.333V634.232H316.891V502.025C316.891 484.307 310.102 479.763 294.712 479.763C278.417 479.763 263.027 484.761 248.995 495.21V634.232H267.553V660.583H153.488Z" fill="white" />
                  <path d="M467.193 664.217C428.719 664.217 403.371 635.595 403.371 589.709V465.68H378.928V439.329H474.888V598.795C474.888 616.06 481.678 621.057 496.615 621.057C514.268 621.057 527.847 612.879 542.784 601.067V465.68H516.984V439.329H614.301V618.785L642.818 631.052V648.771L562.248 662.854H545.953V618.331L545.047 617.877C523.773 644.227 500.688 664.217 467.193 664.217Z" fill="white" />
                  <path d="M716.334 664.217C666.996 664.217 623.995 623.329 623.995 546.549C623.995 470.223 674.691 432.06 726.292 432.06C752.092 432.06 771.103 442.509 785.588 457.956V386.173L753.903 372.544V353.917L839.905 332.109H856.653V618.785L885.622 631.052V648.771L805.051 662.854H788.304V621.057L787.398 620.603C768.388 647.408 747.566 664.217 716.334 664.217ZM739.419 630.143C759.335 630.143 773.819 614.697 785.588 599.25V481.126C774.725 472.949 762.503 467.042 746.208 467.042C732.629 467.042 723.123 472.04 716.786 479.763C708.639 489.758 704.113 515.655 704.113 551.546C704.113 589.255 709.092 612.879 717.239 621.511C723.576 627.872 730.366 630.143 739.419 630.143Z" fill="white" />
                </mask>
              </defs>
              <g>
                <path d="M153.488 660.583V634.232H177.478V386.173L147.604 372.544V353.917L232.247 332.109H248.995V476.129L249.9 476.583C269.364 451.141 291.543 432.06 324.586 432.06C362.608 432.06 388.408 461.136 388.408 506.568V634.232H408.325V660.583H298.333V634.232H316.891V502.025C316.891 484.307 310.102 479.763 294.712 479.763C278.417 479.763 263.027 484.761 248.995 495.21V634.232H267.553V660.583H153.488Z" fill="#272727" />
                <path d="M467.193 664.217C428.719 664.217 403.371 635.595 403.371 589.709V465.68H378.928V439.329H474.888V598.795C474.888 616.06 481.678 621.057 496.615 621.057C514.268 621.057 527.847 612.879 542.784 601.067V465.68H516.984V439.329H614.301V618.785L642.818 631.052V648.771L562.248 662.854H545.953V618.331L545.047 617.877C523.773 644.227 500.688 664.217 467.193 664.217Z" fill="#272727" />
                <path d="M716.334 664.217C666.996 664.217 623.995 623.329 623.995 546.549C623.995 470.223 674.691 432.06 726.292 432.06C752.092 432.06 771.103 442.509 785.588 457.956V386.173L753.903 372.544V353.917L839.905 332.109H856.653V618.785L885.622 631.052V648.771L805.051 662.854H788.304V621.057L787.398 620.603C768.388 647.408 747.566 664.217 716.334 664.217ZM739.419 630.143C759.335 630.143 773.819 614.697 785.588 599.25V481.126C774.725 472.949 762.503 467.042 746.208 467.042C732.629 467.042 723.123 472.04 716.786 479.763C708.639 489.758 704.113 515.655 704.113 551.546C704.113 589.255 709.092 612.879 717.239 621.511C723.576 627.872 730.366 630.143 739.419 630.143Z" fill="#272727" />
              </g>
              <g mask="url(#textMask)">
                <rect x="-300" y="-300" width="300" height="700" fill="url(#shineGradient)" transform="rotate(45 150 500)" className="transition-transform duration-500 ease-out group-hover/logo:translate-x-[1200px] group-hover/logo:translate-y-[1200px] group-hover/logo:duration-700" />
              </g>
              <defs>
                <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </a>
          <div className="absolute right-6 flex items-center gap-2">
            <span className="text-xs text-gray-600 font-mono px-3 py-1.5 rounded-sm border border-black bg-white shadow-brutal">
              {scenarios.length} scenarios
            </span>
            <a
              href="https://hud.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 px-3 py-1.5 rounded-sm border border-black bg-white shadow-brutal hover:shadow-brutal-hover hover:-translate-x-px hover:-translate-y-px active:shadow-brutal-active active:translate-x-0 active:translate-y-0 flex items-center gap-1"
            >
              hud.ai
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={`pt-20 px-6 ${hasSearched ? "pb-6" : "pb-6"}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-tight mb-4">
            Route to the right agent
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10">
            Describe what you need done. We&rsquo;ll find the best agent
            endpoint to handle it — ranked by semantic similarity across{" "}
            {scenarios.length} scenarios.
          </p>

          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            scenarioCount={scenarios.length}
          />

          {/* Query expansion toggle + collapsible result */}
          <div className="mt-3 max-w-2xl mx-auto flex flex-col items-center gap-1.5">
            <button
              onClick={() => setUseQueryExpansion((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span
                className={`relative inline-block w-6 h-3.5 rounded-full transition-colors ${
                  useQueryExpansion ? "bg-amber-400" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                    useQueryExpansion ? "translate-x-2.5" : ""
                  }`}
                />
              </span>
              <span>Query expansion</span>
            </button>

            {hasSearched && !isLoading && refinedQuery && (
              <div>
                <button
                  onClick={() => setShowRefinedQuery((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>View expanded query</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${showRefinedQuery ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showRefinedQuery && (
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed text-left">
                    {refinedQuery}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Category pills */}
          {categories.length > 0 && (
            <div className="mb-8">
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          )}

          {/* Results header */}
          {hasSearched && !isLoading && results && (
            <div className="mb-4 text-sm text-muted">
              Showing {displayItems.length} result
              {displayItems.length !== 1 ? "s" : ""}
              {selectedCategory && (
                <span>
                  {" "}
                  in <span className="capitalize font-medium">{selectedCategory}</span>
                </span>
              )}
            </div>
          )}

          {!hasSearched && !isLoading && (
            <div className="mb-4 text-sm text-muted">
              Browse all scenarios
              {selectedCategory && (
                <span>
                  {" "}
                  in <span className="capitalize font-medium">{selectedCategory}</span>
                </span>
              )}
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-black rounded-lg shadow-brutal p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="skeleton h-5 w-40 mb-2" />
                      <div className="skeleton h-3 w-24" />
                    </div>
                    <div className="skeleton h-6 w-20 rounded-full" />
                  </div>
                  <div className="skeleton h-4 w-full mb-2" />
                  <div className="skeleton h-4 w-3/4 mb-3" />
                  <div className="flex gap-2">
                    <div className="skeleton h-5 w-16 rounded-full" />
                    <div className="skeleton h-5 w-20 rounded" />
                    <div className="skeleton h-5 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results grid */}
          {!isLoading && (
            <div className="space-y-4">
              {displayItems.map((item, idx) => (
                <ScenarioCard
                  key={item.id}
                  scenario={item}
                  rank={hasSearched ? idx + 1 : undefined}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && displayItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-lg">No scenarios found.</p>
              <p className="text-muted/60 text-sm mt-1">
                Try a different query or clear your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted">
          <span>HUD Router</span>
          <span>
            Powered by{" "}
            <a
              href="https://hud.ai"
              className="text-accent hover:text-accent-hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              hud.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
