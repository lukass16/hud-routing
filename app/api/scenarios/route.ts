import { NextResponse } from "next/server";
import { getAllScenarios } from "@/lib/registry";

export async function GET() {
  try {
    const scenarios = await getAllScenarios();
    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error("Failed to load scenarios:", error);
    return NextResponse.json(
      { error: "Failed to load scenarios" },
      { status: 500 }
    );
  }
}
