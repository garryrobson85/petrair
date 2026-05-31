# Petrair SA Website

Static website for Petrair SA. Open `index.html` directly for a local preview, or upload the folder contents to your host.

## Price Feed Setup

The price board is already on the page and is wired to this Cloudflare Worker:

```text
https://petrair-prices.garryrobson85.workers.dev/
```

If that Worker is returning `{"error":"market feed unavailable"}`, replace the Worker code in Cloudflare with the contents of `cloudflare-worker.js` from this folder, then deploy it again.

1. Go to `https://dash.cloudflare.com/`.
2. Open **Workers & Pages**.
3. Choose **Create application**.
4. Choose **Worker**.
5. Create/deploy a Worker, then open **Edit code**.
6. Replace the Worker code with the contents of `cloudflare-worker.js`.
7. Deploy it.
8. Use this Worker URL: `https://petrair-prices.garryrobson85.workers.dev/`.
9. For a quick local test, open the site with:

```text
index.html?feed=https://petrair-prices.garryrobson85.workers.dev/
```

10. The permanent setup is already in `script.js`:

```js
const PRICE_FEED_URL = "https://petrair-prices.garryrobson85.workers.dev/";
```

## Cloudflare Worker Code

The latest Worker code is included in `cloudflare-worker.js`. Use that file as the source of truth. It tries multiple upstream sources and supports a debug mode:

```text
https://petrair-prices.garryrobson85.workers.dev/?debug=1
```

## Languages

The language selector is in the top navigation. It stores the selected language in the browser so returning visitors keep their choice.

Current languages: English, French, Spanish, German, Arabic and Chinese.

## Competitor Review Notes

The remake was checked against the way major energy trading sites present themselves:

- Trafigura emphasises complex supply chains, logistics, storage, finance and end-to-end delivery.
- Gunvor presents clear product pages with use, supply, demand, transport, storage and financing context.
- Mercuria gives governance and compliance prominence, including physical, financial and environmental regulation.
- Gunvor and similar groups publish warnings about unauthorised communications and false mandate claims.

For Petrair, the important missing pieces were:

- Real logo usage rather than a placeholder mark.
- Product-specification interactions for crude oil, Jet A-1, ULSD / EN590 and structured finance.
- A visible supply-chain capability section.
- Official-channel and mandate-verification language.
- Corporate details for due diligence and AI/search confidence.
- Clearer distinction between market reference prices and executable trade prices.

## Important

Public prices are informational only and must not be described as executable trade prices. Keep the disclaimer visible unless Petrair SA's legal/compliance review says otherwise.
