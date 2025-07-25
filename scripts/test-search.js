const { Search } = require("@upstash/search");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");
    
    for (const line of lines) {
      if (line.trim() && !line.startsWith("#")) {
        const [key, value] = line.split("=", 2);
        if (key && value) {
          process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  } catch (error) {
    console.error("Error loading .env.local:", error);
  }
}

loadEnv();

const client = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN,
});

const index = client.index("vercel-docs");

async function testSearch() {
  try {
    console.log("Testing search for 'frontend cloud'...");
    const results = await index.search({ query: "frontend cloud" });
    console.log("Results:", JSON.stringify(results, null, 2));
    
    console.log("\nTesting search for 'Next.js'...");
    const results2 = await index.search({ query: "Next.js" });
    console.log("Results:", JSON.stringify(results2, null, 2));
    
    console.log("\nTesting search for 'performance'...");
    const results3 = await index.search({ query: "performance" });
    console.log("Results:", JSON.stringify(results3, null, 2));
    
  } catch (error) {
    console.error("Search error:", error);
  }
}

testSearch();