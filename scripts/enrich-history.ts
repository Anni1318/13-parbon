import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

// Use the first available Gemini key (or loop through them if needed)
const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("FATAL: No Gemini API key found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Using gemini-3.6-flash since the user's account supports it
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processBatch(pandals: {id: string, name: string}[]) {
  const prompt = `
You are an expert on Kolkata Durga Puja history.
I am providing a list of Durga Puja pandal names. For each pandal, if it is a known/famous pandal, please provide its theme and history for the last 5 years (2021, 2022, 2023, 2024, 2025). 

To ensure the highest accuracy, please cross-reference your internal knowledge against these standard archives and sources for Durga Puja themes:
1. AASAN Puja Permission Portal (aasan.wb.gov.in)
2. UNESCO Intangible Cultural Heritage Database (ich.unesco.org)
3. Indian Festival Diary (indianfestivaldiary.com/durgapuja)
4. Durga Puja Parikrama (durgapujaparikrama.com)
5. Travel Amigo (travelamigo.co.in - e.g., Ahiritola Sarbojonin, Kumartuli Park, Sreebhumi)
6. Wikipedia Club Pages (e.g., Santosh Mitra Square)
7. Academic & Research Publications (e.g., ResearchGate papers on heritage and design)
8. Digital News Outlets (e.g., The Times of India, iDiva, The Federal)

If a pandal is obscure or you cannot verify the EXACT, SPECIFIC creative theme for a given year using reliable sources, DO NOT hallucinate and DO NOT use generic filler themes like "Traditional Durga Puja". Instead, omit that year entirely. If you have no data for the pandal at all, omit the pandal entirely.

Input Pandals:
${JSON.stringify(pandals, null, 2)}

Return a JSON array of objects. Each object must strictly match this schema:
[
  {
    "pandalId": "string (exactly matching the input id)",
    "editions": [
      {
        "year": 2021,
        "theme": "string (the theme name in english)",
        "themeDescription": "string (1-2 sentences about the theme and significance)",
        "awards": ["string"]
      }
    ]
  }
]
Return ONLY valid JSON matching this structure. Do not include markdown formatting or backticks.
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text() || "[]";
    
    // Clean up possible markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(text);

    if (!Array.isArray(data)) {
      console.warn("Expected array from AI, got something else:", data);
      return;
    }

    let insertedCount = 0;

    for (const item of data) {
      if (!item.pandalId || !Array.isArray(item.editions)) continue;

      for (const edition of item.editions) {
        if (!edition.year || !edition.theme) continue;

        await prisma.pandalEdition.upsert({
          where: {
            pandalId_year: {
              pandalId: item.pandalId,
              year: edition.year,
            },
          },
          create: {
            pandalId: item.pandalId,
            year: edition.year,
            theme: edition.theme,
            themeDescription: edition.themeDescription || null,
            awards: edition.awards && Array.isArray(edition.awards) ? JSON.stringify(edition.awards) : '[]',
          },
          update: {
            theme: edition.theme,
            themeDescription: edition.themeDescription || null,
            awards: edition.awards && Array.isArray(edition.awards) ? JSON.stringify(edition.awards) : '[]',
          },
        });
        insertedCount++;
      }
    }
    
    console.log(`Successfully processed batch and inserted/updated ${insertedCount} historical records.`);
  } catch (error) {
    console.error("Error processing batch with AI:", error);
  }
}

async function main() {
  console.log("Fetching pandals from database...");
  const allPandals = await prisma.pandal.findMany({
    select: { id: true, name: true, _count: { select: { editions: true } } }
  });

  const remainingPandals = allPandals.filter(p => p._count.editions < 5);
  console.log(`Found ${remainingPandals.length} pandals missing full 5-year history. Fetching data in batches of 15...`);
  
  const BATCH_SIZE = 15;
  for (let i = 0; i < remainingPandals.length; i += BATCH_SIZE) {
    const batch = remainingPandals.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(remainingPandals.length / BATCH_SIZE)}...`);
    
    await processBatch(batch);
    
    // Delay 4 seconds to avoid rate limiting
    if (i + BATCH_SIZE < remainingPandals.length) {
      await delay(4000);
    }
  }

  console.log("Enrichment complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
