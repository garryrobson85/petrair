const YAHOO_SYMBOLS = {
  brent: "BZ=F",
  wti: "CL=F",
  diesel: "HO=F"
};

const STOOQ_SYMBOLS = {
  brent: "QA.F",
  wti: "CL.F",
  diesel: "HO.F"
};

const FALLBACK = {
  brent: { price: 82.44, prev: 82.12 },
  wti: { price: 77.91, prev: 77.55 },
  diesel: { price: 2.55, prev: 2.53 }
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const debug = url.searchParams.has("debug");
    const notes = [];

    let output = await yahooQuote(notes);
    if (Object.keys(output).length < 3) {
      output = { ...output, ...(await yahooCharts(notes)) };
    }
    if (Object.keys(output).length < 3) {
      output = { ...output, ...(await stooqEnergy(notes)) };
    }

    for (const [key, value] of Object.entries(FALLBACK)) {
      if (!output[key]) {
        output[key] = { ...value, source: "fallback-indicative" };
      }
    }

    return json(debug ? { prices: output, debug: notes } : output, 200);
  }
};

async function yahooQuote(notes) {
  const endpoint =
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" +
    encodeURIComponent(Object.values(YAHOO_SYMBOLS).join(","));

  try {
    const response = await fetch(endpoint, yahooOptions());
    notes.push(`yahoo quote status ${response.status}`);
    if (!response.ok) return {};

    const data = await response.json();
    const quotes = data.quoteResponse?.result || [];
    const bySymbol = Object.fromEntries(quotes.map((quote) => [quote.symbol, quote]));
    const output = {};

    for (const [key, symbol] of Object.entries(YAHOO_SYMBOLS)) {
      const quote = bySymbol[symbol];
      if (!quote || typeof quote.regularMarketPrice !== "number") continue;
      output[key] = {
        price: Number(quote.regularMarketPrice),
        prev: Number(quote.regularMarketPreviousClose || quote.regularMarketPrice),
        source: "yahoo-quote"
      };
    }

    return output;
  } catch (error) {
    notes.push(`yahoo quote error ${error.message}`);
    return {};
  }
}

async function yahooCharts(notes) {
  const output = {};

  for (const [key, symbol] of Object.entries(YAHOO_SYMBOLS)) {
    try {
      const endpoint = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1m`;
      const response = await fetch(endpoint, yahooOptions());
      notes.push(`yahoo chart ${key} status ${response.status}`);
      if (!response.ok) continue;

      const data = await response.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta || typeof meta.regularMarketPrice !== "number") continue;

      output[key] = {
        price: Number(meta.regularMarketPrice),
        prev: Number(meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice),
        source: "yahoo-chart"
      };
    } catch (error) {
      notes.push(`yahoo chart ${key} error ${error.message}`);
    }
  }

  return output;
}

async function stooqEnergy(notes) {
  try {
    const response = await fetch("https://stooq.com/t/?i=553", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    notes.push(`stooq energy status ${response.status}`);
    if (!response.ok) return {};

    const html = await response.text();
    const text = html
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ");
    const output = {};

    for (const [key, symbol] of Object.entries(STOOQ_SYMBOLS)) {
      const value = parseStooqRow(text, symbol);
      if (value) output[key] = { ...value, source: "stooq-energy" };
    }

    return output;
  } catch (error) {
    notes.push(`stooq energy error ${error.message}`);
    return {};
  }
}

function parseStooqRow(text, symbol) {
  const escaped = symbol.replace(".", "\\.");
  const match = text.match(new RegExp(`${escaped}\\s+[^0-9+-]*?([0-9]+(?:\\.[0-9]+)?)\\s+([+-][0-9]+(?:\\.[0-9]+)?)%?`, "i"));
  if (!match) return null;

  const price = Number(match[1]);
  const change = Number(match[2]);
  if (!Number.isFinite(price) || !Number.isFinite(change)) return null;

  return {
    price,
    prev: price - change
  };
}

function yahooOptions() {
  return {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json,text/plain,*/*"
    }
  };
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=45"
    }
  });
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}
