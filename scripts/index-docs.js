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

// Initialize Upstash Search client
const client = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN,
});

const index = client.index("vercel-docs");

function chunkContent(content, maxSize) {
  if (content.length <= maxSize) {
    return [content];
  }
  
  const chunks = [];
  const paragraphs = content.split('\n\n');
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the limit
    if (currentChunk.length + paragraph.length + 2 > maxSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        // Single paragraph is too long, split by sentences
        const sentences = paragraph.split('. ');
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length + 2 > maxSize) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
              currentChunk = sentence;
            } else {
              // Even single sentence is too long, just truncate
              chunks.push(sentence.substring(0, maxSize));
            }
          } else {
            currentChunk += (currentChunk ? '. ' : '') + sentence;
          }
        }
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

function parseDocument(filePath) {
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
      const baseId = path.basename(file, ".html");
      const maxChunkSize = 3000; // Leave room for metadata
      
      // Simple chunking by paragraphs/sections
      const chunks = chunkContent(document.content, maxChunkSize);
      
      chunks.forEach((chunk, index) => {
        const chunkId = chunks.length > 1 ? `${baseId}-chunk-${index + 1}` : baseId;
        
        documentsToIndex.push({
          id: chunkId,
          content: {
            title: document.title,
            url: document.url,
            publishedTime: document.publishedTime,
            text: chunk,
            chunkIndex: index + 1,
            totalChunks: chunks.length,
          },
          metadata: {
            filename: file,
            source: "vercel-resources",
            originalId: baseId,
          },
        });
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
    const searchResults = await index.search("frontend cloud", { topK: 5 });
    console.log("Search results for 'frontend cloud':", JSON.stringify(searchResults, null, 2));
    
  } catch (error) {
    console.error("Error during indexing:", error);
  }
}

indexDocuments().catch(console.error);