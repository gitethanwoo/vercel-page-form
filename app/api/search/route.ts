import { Search } from "@upstash/search";
import { NextRequest, NextResponse } from "next/server";

const client = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});

const index = client.index("vercel-docs");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const results = await index.search({ query });

    return NextResponse.json({
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required in request body" },
        { status: 400 }
      );
    }

    const searchOptions = {
      query,
      ...options,
    };

    const results = await index.search(searchOptions);

    return NextResponse.json({
      query,
      results,
      count: results.length,
      options: options || {},
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}