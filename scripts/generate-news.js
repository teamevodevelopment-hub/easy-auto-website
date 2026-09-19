/* =========================================================
   EASY AUTO — Daily auto news generator
   ---------------------------------------------------------
   Run by the GitHub Actions workflow (.github/workflows/daily-news.yml)
   once a day. Calls the Anthropic API with web search enabled to find
   real, current automotive industry news, then writes the result to
   assets/news-data.js in the same format the site already uses for
   gallery-data.js and lenders-data.js.

   Needs the ANTHROPIC_API_KEY environment variable set — the GitHub
   Actions workflow supplies this from a repository secret, so you
   should never need to put a real key directly in this file.
   ========================================================= */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set. Add it as a GitHub repository secret (see setup instructions).');
  process.exit(1);
}

const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'news-data.js');

const SYSTEM_PROMPT = `You find and summarize current automotive industry news for a Canadian car-financing company's website. Search for real, recent news (published within the last few days) covering topics like: new vehicle releases, auto industry trends, car loan/interest rate news in Canada, EV market news, and general car-buying advice trends. Avoid anything overly technical, niche motorsport content, or US-only content that doesn't apply to Canadian readers.

Respond with ONLY a JSON array (no other text, no markdown code fences) of exactly 6 news items, newest/most relevant first, in this exact format:

[
  {
    "title": "Short, clear headline (under 90 characters)",
    "summary": "2-3 sentence plain-English summary in your own words, not copied from the source. No direct quotes longer than a few words.",
    "source": "Name of the original publication",
    "sourceUrl": "Direct URL to the original article",
    "date": "YYYY-MM-DD of original publication"
  }
]

Only include items where you have a real, verifiable source URL from your search results. If you cannot find 6 genuinely relevant, recent items, return fewer rather than inventing any.`;

function repairTruncatedJsonArray(text) {
  // Finds every top-level {...} object in the text and parses each one
  // individually, skipping the last one if it's incomplete. This lets us
  // recover, say, 4 good items out of an intended 6 rather than nothing.
  const items = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const candidate = text.slice(start, i + 1);
        try {
          items.push(JSON.parse(candidate));
        } catch (e) {
          // skip malformed fragment
        }
        start = -1;
      }
    }
  }
  return items;
}

async function generateNews() {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 10000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: 'Find today\'s automotive industry news relevant to Canadian car buyers and car financing.' }
      ],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errText}`);
  }

  const data = await response.json();

  // The response may include text blocks, tool_use blocks, and tool_result
  // blocks (from the web search). We only want the final text Claude wrote.
  const textBlocks = data.content.filter(block => block.type === 'text').map(block => block.text);
  const fullText = textBlocks.join('\n').trim();

  // Strip markdown code fences if Claude added them despite instructions not to.
  const cleaned = fullText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let newsItems;
  try {
    newsItems = JSON.parse(cleaned);
  } catch (err) {
    // If the response got cut off before the JSON array closed properly
    // (e.g. an unusually long run of search tool calls ate into the
    // token budget), try to salvage whichever complete items came
    // through rather than throwing away the whole run.
    console.warn('Initial JSON parse failed, attempting to salvage complete items from a possibly truncated response...');
    const repaired = repairTruncatedJsonArray(cleaned);
    if (repaired && repaired.length > 0) {
      console.warn(`Salvaged ${repaired.length} complete item(s) from the truncated response.`);
      newsItems = repaired;
    } else {
      throw new Error(`Failed to parse JSON from Claude's response, and no complete items could be salvaged. Raw response:\n${fullText}`);
    }
  }

  if (!Array.isArray(newsItems) || newsItems.length === 0) {
    throw new Error('Claude returned an empty or invalid news list.');
  }

  return newsItems;
}

function escapeForJS(str) {
  return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildFileContent(newsItems) {
  const generatedAt = new Date().toISOString();
  const entries = newsItems.map(item => `  {
    title: "${escapeForJS(item.title)}",
    summary: "${escapeForJS(item.summary)}",
    source: "${escapeForJS(item.source)}",
    sourceUrl: "${escapeForJS(item.sourceUrl)}",
    date: "${escapeForJS(item.date)}"
  }`).join(',\n');

  return `/* =========================================================
   EASY AUTO — Auto industry news
   ---------------------------------------------------------
   Auto-generated daily by scripts/generate-news.js via GitHub Actions.
   Last updated: ${generatedAt}
   Do not edit this file by hand — changes will be overwritten on the
   next scheduled run. To change how news is selected or summarized,
   edit the SYSTEM_PROMPT in scripts/generate-news.js instead.
   ========================================================= */
const NEWS_DATA = {
  generatedAt: "${generatedAt}",
  items: [
${entries}
  ]
};
`;
}

async function main() {
  console.log('Fetching latest auto news via Anthropic API...');
  try {
    const newsItems = await generateNews();
    const fileContent = buildFileContent(newsItems);
    fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf8');
    console.log(`Success — wrote ${newsItems.length} news items to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('Failed to generate news:', err.message);
    console.error('Leaving the existing assets/news-data.js untouched so the site keeps showing yesterday\'s content rather than breaking.');
    process.exit(1);
  }
}

main();
