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
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.results);
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
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">HUD</span>
            <span className="text-muted text-sm font-light">Router</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted font-mono bg-surface px-2.5 py-1 rounded-full border border-border">
              {scenarios.length} scenarios
            </span>
            <a
              href="https://hud.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground flex items-center gap-1"
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
      <section className="pt-20 pb-12 px-6">
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
                <div key={i} className="bg-card border border-border rounded-xl p-5">
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
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted">
          <span>HUD Router &mdash; Founding Engineer Takehome</span>
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
