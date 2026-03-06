import { NextRequest, NextResponse } from "next/server";
import { searchScenarios } from "@/lib/registry";

export async function POST(request: NextRequest) {
  try {
    const { query, refine } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const { results, refinedQuery } = await searchScenarios(
      query,
      20,
      refine !== false
    );

    return NextResponse.json({ results, refinedQuery });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
