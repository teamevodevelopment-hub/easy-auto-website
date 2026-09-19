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
const ITEM_COUNT = 10;
const MAX_TOTAL_ITEMS = 100;
// ^ Once the archive reaches this many articles, the oldest ones get
// dropped off the bottom as new ones are added on top — keeps the page
// (and this file) from growing forever. At 10 new items/day this holds
// roughly the last 10 days. Raise this number if you want a longer
// archive, or lower it to keep the page shorter.

function readExistingItems() {
  if (!fs.existsSync(OUTPUT_PATH)) return [];
  try {
    const src = fs.readFileSync(OUTPUT_PATH, 'utf8');
    const data = new Function(src + '; return NEWS_DATA;')();
    return (data && Array.isArray(data.items)) ? data.items : [];
  } catch (e) {
    console.log(`Could not read existing news-data.js (${e.message}) — starting fresh with no prior items.`);
    return [];
  }
}

function mergeWithExisting(newItems, existingItems) {
  const existingUrls = new Set(existingItems.map(i => i.sourceUrl));
  const genuinelyNew = newItems.filter(i => !existingUrls.has(i.sourceUrl));
  const skipped = newItems.length - genuinelyNew.length;
  if (skipped > 0) {
    console.log(`Skipped ${skipped} item(s) already in the archive (matched by sourceUrl).`);
  }
  const merged = [...genuinelyNew, ...existingItems];
  if (merged.length > MAX_TOTAL_ITEMS) {
    console.log(`Archive would be ${merged.length} items, trimming oldest down to ${MAX_TOTAL_ITEMS}.`);
    return merged.slice(0, MAX_TOTAL_ITEMS);
  }
  return merged;
}

const SYSTEM_PROMPT = `You find and summarize current automotive industry news for a Canadian car-financing company's website. Search for real, recent news (published within the last few days) covering topics like: new vehicle releases, auto industry trends, car loan/interest rate news in Canada, EV market news, and general car-buying advice trends. Avoid anything overly technical, niche motorsport content, or US-only content that doesn't apply to Canadian readers.

Respond with ONLY a JSON array (no other text before or after it, no markdown code fences) of exactly ${ITEM_COUNT} news items, newest/most relevant first, in this exact format:

[
  {
    "title": "Short, clear headline (under 90 characters)",
    "summary": "One or two plain-English sentences in your own words, not copied from the source. No direct quotes.",
    "source": "Name of the original publication",
    "sourceUrl": "Direct URL to the original article",
    "date": "YYYY-MM-DD of original publication"
  }
]

Keep summaries brief — one or two sentences each, not three. Only include items where you have a real, verifiable source URL from your search results. If you cannot find ${ITEM_COUNT} genuinely relevant, recent items, return fewer rather than inventing any. Do your searching first, then write the final JSON array as the very last thing in your response.`;

// A proper string-aware brace matcher: tracks whether we're currently
// inside a quoted string (and respects escaped quotes like \") so that
// any stray { or } characters that happen to appear inside a summary's
// text don't throw off the matching. Used to salvage complete items out
// of a response that got cut off before its closing bracket.
function repairTruncatedJsonArray(text) {
  const items = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escapeNext) { escapeNext = false; continue; }
    if (ch === '\\') { escapeNext = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;

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
          // incomplete or malformed fragment, skip it
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
      max_tokens: 16000,
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

  // This is the single most important diagnostic line in this whole
  // script — Anthropic's API tells us directly why generation stopped.
  // "end_turn" = Claude finished normally. "max_tokens" = it got cut off
  // because the token ceiling was hit, confirming that specific cause
  // rather than us having to guess from a JSON parse failure.
  console.log(`API stop_reason: ${data.stop_reason}`);

  const textBlocks = data.content.filter(block => block.type === 'text').map(block => block.text);
  const fullText = textBlocks.join('\n').trim();
  console.log(`Received ${textBlocks.length} text block(s), ${fullText.length} characters total.`);

  const cleaned = fullText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let newsItems;
  let usedRepair = false;
  try {
    newsItems = JSON.parse(cleaned);
    console.log('JSON parsed successfully on the first attempt.');
  } catch (err) {
    console.log(`Direct JSON.parse failed (${err.message}). Attempting to salvage complete items...`);
    const repaired = repairTruncatedJsonArray(cleaned);
    console.log(`Repair function found ${repaired.length} complete item(s).`);
    if (repaired.length > 0) {
      newsItems = repaired;
      usedRepair = true;
    } else {
      console.log('=== RAW RESPONSE TEXT (for debugging) ===');
      console.log(fullText);
      console.log('=== END RAW RESPONSE TEXT ===');
      throw new Error('Could not parse or salvage any items from the response — see raw text above.');
    }
  }

  if (!Array.isArray(newsItems) || newsItems.length === 0) {
    throw new Error('Claude returned an empty or invalid news list.');
  }

  console.log(`Proceeding with ${newsItems.length} item(s)${usedRepair ? ' (recovered via repair)' : ''}.`);
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
    const newItems = await generateNews();
    const existingItems = readExistingItems();
    console.log(`Found ${existingItems.length} existing item(s) already on the site.`);
    const mergedItems = mergeWithExisting(newItems, existingItems);
    const fileContent = buildFileContent(mergedItems);
    fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf8');
    console.log(`Success — archive now has ${mergedItems.length} total item(s) at ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('Failed to generate news:', err.message);
    console.error('Leaving the existing assets/news-data.js untouched so the site keeps showing yesterday\'s content rather than breaking.');
    process.exit(1);
  }
}

main();
