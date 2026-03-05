import { ScenarioEntry, SearchResult, SearchResponse } from "./types";
import { embed, cosineSimilarity } from "./embeddings";
import { refineQuery } from "./query-refinement";
import scenariosData from "../data/scenarios.json";

let cachedScenarios: ScenarioEntry[] | null = null;

function buildEmbeddingText(scenario: ScenarioEntry): string {
  const toolDescriptions = scenario.tools
    .map((t) => `${t.name}: ${t.description}`)
    .join("; ");
  const queries = scenario.syntheticQueries.join("; ");
  return `${scenario.name} | ${scenario.description} | ${toolDescriptions} | ${queries}`;
}

async function getEmbeddedScenarios(): Promise<ScenarioEntry[]> {
  if (cachedScenarios) return cachedScenarios;

  const scenarios = scenariosData as ScenarioEntry[];

  const embeddingPromises = scenarios.map(async (scenario) => {
    const text = buildEmbeddingText(scenario);
    const vector = await embed(text);
    return { ...scenario, embedding: vector };
  });

  cachedScenarios = await Promise.all(embeddingPromises);
  return cachedScenarios;
}

export async function searchScenarios(
  query: string,
  topK = 20
): Promise<SearchResponse> {
  const [refinedQuery, scenarios] = await Promise.all([
    refineQuery(query),
    getEmbeddedScenarios(),
  ]);

  const queryEmbedding = await embed(refinedQuery);

  const results: SearchResult[] = scenarios.map((scenario) => ({
    ...scenario,
    score: cosineSimilarity(queryEmbedding, scenario.embedding!),
  }));

  results.sort((a, b) => b.score - a.score);
  return { results: results.slice(0, topK), refinedQuery };
}

export async function getAllScenarios(): Promise<ScenarioEntry[]> {
  const scenarios = scenariosData as ScenarioEntry[];
  return scenarios.map(({ embedding: _, ...rest }) => rest) as ScenarioEntry[];
}
