"use client";

import { useState } from "react";
import { SearchResult } from "@/lib/types";
import ConfidenceBadge from "./ConfidenceBadge";

interface ScenarioCardProps {
  scenario: SearchResult;
  rank?: number;
}

const categoryColors: Record<string, string> = {
  research: "bg-blue-50 text-blue-700 border-blue-200",
  development: "bg-violet-50 text-violet-700 border-violet-200",
  devops: "bg-emerald-50 text-emerald-700 border-emerald-200",
  data: "bg-cyan-50 text-cyan-700 border-cyan-200",
  communication: "bg-pink-50 text-pink-700 border-pink-200",
  automation: "bg-yellow-50 text-yellow-700 border-yellow-200",
  productivity: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function ScenarioCard({ scenario, rank }: ScenarioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  const category = scenario.metadata?.category || "other";
  const categoryStyle =
    categoryColors[category] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="group bg-card border border-border rounded-xl hover:shadow-md hover:border-accent/30">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {rank !== undefined && (
                <span className="text-xs font-mono text-muted">
                  #{rank}
                </span>
              )}
              <h3 className="font-serif text-lg font-semibold text-foreground truncate">
                {scenario.name}
              </h3>
              <span className="text-xs text-muted font-mono bg-surface px-2 py-0.5 rounded">
                {scenario.environment}
              </span>
            </div>
          </div>
          {scenario.score > 0 && <ConfidenceBadge score={scenario.score} />}
        </div>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed mb-3">
          {scenario.description}
        </p>

        {/* Tags row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${categoryStyle}`}
          >
            {category}
          </span>
          {scenario.tools.slice(0, 3).map((tool) => (
            <span
              key={tool.name}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono text-muted bg-surface border border-border"
            >
              {tool.name}
            </span>
          ))}
          {scenario.tools.length > 3 && (
            <span className="text-xs text-muted">
              +{scenario.tools.length - 3} more
            </span>
          )}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
        >
          {isExpanded ? "Close" : "Use this agent"}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded detail section */}
      {isExpanded && (
        <div className="border-t border-border px-5 py-4 bg-surface/50 rounded-b-xl">
          {/* Parameters */}
          {scenario.parameters.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Parameters
              </h4>
              <div className="space-y-2">
                {scenario.parameters.map((param) => (
                  <div key={param.name}>
                    <label className="flex items-center gap-1.5 text-sm mb-1">
                      <span className="font-mono text-foreground">
                        {param.name}
                      </span>
                      <span className="text-xs text-muted">
                        ({param.type})
                      </span>
                      {param.required && (
                        <span className="text-red-500 text-xs">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder={param.description}
                      value={paramValues[param.name] || ""}
                      onChange={(e) =>
                        setParamValues((prev) => ({
                          ...prev,
                          [param.name]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent placeholder:text-muted/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Available Tools
            </h4>
            <div className="space-y-1.5">
              {scenario.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-start gap-2 text-sm"
                >
                  <code className="font-mono text-accent text-xs mt-0.5 shrink-0">
                    {tool.name}
                  </code>
                  <span className="text-muted text-xs">
                    {tool.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Example queries */}
          {scenario.syntheticQueries.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Example Queries
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {scenario.syntheticQueries.map((q, i) => (
                  <span
                    key={i}
                    className="inline-block px-2.5 py-1 text-xs rounded-full bg-accent-light text-accent border border-accent/20"
                  >
                    &ldquo;{q}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Run button */}
          <button className="w-full py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover">
            Run Agent
          </button>
        </div>
      )}
    </div>
  );
}
