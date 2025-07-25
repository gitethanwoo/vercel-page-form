import { Search } from "@upstash/search";
import * as fs from "fs";
import * as path from "path";

// Initialize Upstash Search client
const client = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});

const index = client.index("vercel-docs");

interface Document {
  title: string;
  url: string;
  publishedTime: string;
  content: string;
}

function parseDocument(filePath: string): Document | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    
    let title = "";
    let url = "";
    let publishedTime = "";
    let markdownContent = "";
    
    let inMarkdownSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith("Title: ")) {
        title = line.replace("Title: ", "").trim();
      } else if (line.startsWith("URL Source: ")) {
        url = line.replace("URL Source: ", "").trim();
      } else if (line.startsWith("Published Time: ")) {
        publishedTime = line.replace("Published Time: ", "").trim();
      } else if (line.startsWith("Markdown Content:")) {
        inMarkdownSection = true;
        continue;
      } else if (inMarkdownSection) {
        markdownContent += line + "\n";
      }
    }
    
    return {
      title: title || path.basename(filePath, ".html"),
      url: url || "",
      publishedTime: publishedTime || "",
      content: markdownContent.trim(),
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

async function indexDocuments() {
  const docsDir = path.join(process.cwd(), "vercel_resources");
  const files = fs.readdirSync(docsDir).filter(file => file.endsWith(".html"));
  
  console.log(`Found ${files.length} documents to index`);
  
  const documentsToIndex = [];
  
  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const document = parseDocument(filePath);
    
    if (document) {
      const id = path.basename(file, ".html");
      documentsToIndex.push({
        id,
        content: {
          title: document.title,
          url: document.url,
          publishedTime: document.publishedTime,
          text: document.content,
        },
        metadata: {
          filename: file,
          source: "vercel-resources",
        },
      });
    }
  }
  
  console.log(`Indexing ${documentsToIndex.length} documents...`);
  
  try {
    // Index documents in batches
    const batchSize = 10;
    for (let i = 0; i < documentsToIndex.length; i += batchSize) {
      const batch = documentsToIndex.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`Indexed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documentsToIndex.length / batchSize)}`);
    }
    
    console.log("All documents indexed successfully!");
    
    // Test search
    console.log("\nTesting search...");
    const searchResults = await index.search("frontend cloud");
    console.log("Search results for 'frontend cloud':", searchResults);
    
  } catch (error) {
    console.error("Error during indexing:", error);
  }
}

indexDocuments().catch(console.error);