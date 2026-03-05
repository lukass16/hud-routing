"use client";

import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  scenarioCount: number;
}

export default function SearchBar({
  onSearch,
  isLoading,
  scenarioCount,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
      }
    },
    [query, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you need an agent to do?"
            className="w-full pl-12 pr-24 py-4 text-lg rounded-full border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted/60"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-28 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-surface"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Embedding query &middot; Searching {scenarioCount} scenarios&hellip;</span>
        </div>
      )}
    </div>
  );
}
