export interface Tool {
  name: string;
  description: string;
  parameters?: Record<string, { type: string; description: string }>;
}

export interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface ScenarioEntry {
  id: string;
  name: string;
  environment: string;
  model: string;
  description: string;
  tools: Tool[];
  parameters: Parameter[];
  syntheticQueries: string[];
  embedding?: number[];
  metadata?: {
    category?: string;
    author?: string;
    successRate?: number;
  };
}

export interface SearchResult extends ScenarioEntry {
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  refinedQuery: string | null;
}
