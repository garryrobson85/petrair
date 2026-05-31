const VERSION = "petrair-lead-brief-2026-05-31-v2";

const DEFAULT_LEAD_EMAIL = "garryrobson85@googlemail.com";
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "proton.me",
  "protonmail.com",
  "aol.com"
]);

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });
    if (request.method !== "POST") return json({ version: VERSION, ok: true }, 200);

    let enquiry;
    try {
      enquiry = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400);
    }

    const brief = await buildLeadBrief(enquiry, env);

    if (env.LEAD_WEBHOOK_URL) {
      await sendWebhook(env.LEAD_WEBHOOK_URL, brief);
    }

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      await sendTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, brief);
    }

    if (env.RESEND_API_KEY) {
      await sendEmail(env.RESEND_API_KEY, brief, env.LEAD_TO_EMAIL || DEFAULT_LEAD_EMAIL);
    }

    return json({ ok: true, version: VERSION }, 200);
  }
};

async function buildLeadBrief(enquiry, env) {
  const email = clean(enquiry.Email);
  const emailDomain = email.includes("@") ? email.split("@").pop().toLowerCase() : "";
  const company = clean(enquiry.Company);
  const product = clean(enquiry.Product);
  const message = clean(enquiry.Message);
  const inferredSite = inferCompanySite(emailDomain);
  const domainInfo = await checkDomain(inferredSite);
  const notes = buildPreparationNotes({ enquiry, emailDomain, company, product, message, domainInfo });

  const deterministicBrief = {
    version: VERSION,
    createdAt: new Date().toISOString(),
    lead: {
      name: clean(enquiry.Name),
      email,
      emailDomain,
      company,
      product,
      quantity: clean(enquiry.Quantity),
      destination: clean(enquiry.Destination),
      message,
      submittedPage: clean(enquiry.Page),
      submittedAt: clean(enquiry.SubmittedAt)
    },
    research: {
      inferredCompanyWebsite: inferredSite,
      emailDomainType: FREE_EMAIL_DOMAINS.has(emailDomain) ? "personal/free email domain" : "company or private domain",
      websiteCheck: domainInfo,
      searchLinks: {
        companyWebsite: inferredSite || "",
        companySearch: searchUrl(`${company} energy trading commodities`),
        personSearch: searchUrl(`${clean(enquiry.Name)} ${company}`),
        linkedInPerson: searchUrl(`site:linkedin.com/in ${clean(enquiry.Name)} ${company}`),
        linkedInCompany: searchUrl(`site:linkedin.com/company ${company}`),
        registrySearch: searchUrl(`${company} company registry`),
        sanctionsContext: searchUrl(`${company} sanctions compliance`)
      }
    },
    salespersonPrep: {
      summary: buildSummary(enquiry, emailDomain, domainInfo),
      notes,
      suggestedQuestions: buildQuestions(enquiry),
      replyAngle: buildReplyAngle(product)
    }
  };

  deterministicBrief.ai = await buildAiPrep(enquiry, deterministicBrief, env);
  return deterministicBrief;
}

function buildSummary(enquiry, emailDomain, domainInfo) {
  const parts = [
    `${clean(enquiry.Name) || "A contact"} submitted a Petrair RFQ`,
    clean(enquiry.Company) ? `for ${clean(enquiry.Company)}` : "without a company name",
    clean(enquiry.Product) ? `covering ${clean(enquiry.Product)}` : "without a product selected"
  ];
  const domainText = emailDomain
    ? `Email domain is ${emailDomain}; ${domainInfo.status}.`
    : "No email domain could be checked.";
  return `${parts.join(" ")}. ${domainText}`;
}

function buildPreparationNotes({ enquiry, emailDomain, company, product, message, domainInfo }) {
  const notes = [];

  if (FREE_EMAIL_DOMAINS.has(emailDomain)) {
    notes.push("Contact used a personal/free email domain. Keep the first response polite, but ask for corporate profile and official company-domain contact details before sharing sensitive commercial documents.");
  }
  if (!company) notes.push("Company name is missing. Ask for legal company name, registration country and role in the transaction.");
  if (!domainInfo.reachable && emailDomain && !FREE_EMAIL_DOMAINS.has(emailDomain)) {
    notes.push("The inferred company website was not reachable during the automatic check. Use the prepared search links before replying with detailed trade terms.");
  }
  if (/mandate|allocation|urgent|procedure|working with refinery|seller mandate|buyer mandate/i.test(message)) {
    notes.push("Message contains language often seen in intermediary or mandate-led approaches. Prepare verification questions around authority, buyer/seller role and bankable transaction path.");
  }
  if (/jet|a-1|aviation/i.test(product + " " + message)) {
    notes.push("For Jet A-1, verify destination airport/terminal, specification basis, volume schedule, inspection expectations and settlement instrument.");
  }
  if (/crude/i.test(product + " " + message)) {
    notes.push("For crude oil, verify grade, origin constraints, lifting window, Incoterm, destination refinery/trader role and documentary chain.");
  }
  if (/ulsd|en590|diesel/i.test(product + " " + message)) {
    notes.push("For ULSD 10ppm, verify sulphur basis, destination, monthly schedule, inspection location and whether pricing is index-linked.");
  }
  if (/\blpg\b|propane|butane|liquefied petroleum/i.test(product + " " + message)) {
    notes.push("For LPG, verify propane/butane mix, storage basis, terminal, vessel/transport route, pressure/refrigeration requirements and documentary chain.");
  }

  notes.push("This brief is preparation only. It is not KYC, sanctions clearance or a decision on legitimacy.");
  return notes;
}

function buildQuestions(enquiry) {
  const questions = [
    "Please confirm the legal buyer/seller entity, registration country and your role in the transaction.",
    "Please confirm product specification, quantity, destination, delivery window and preferred Incoterm.",
    "Please confirm expected payment instrument, issuing bank route and inspection requirements."
  ];
  if (!clean(enquiry.Company)) questions.unshift("What is the full legal company name and website?");
  return questions;
}

function buildReplyAngle(product) {
  const item = product || "the requested product";
  return `Thank them for the enquiry about ${item}. Keep pricing clearly indicative pending KYC, availability, specification, destination, delivery window, Incoterm and bank/documentary review.`;
}

async function buildAiPrep(enquiry, brief, env) {
  if (!env.OPENROUTER_API_KEY) {
    return {
      enabled: false,
      note: "AI prep not enabled. Add OPENROUTER_API_KEY to the Worker if AI summary, translation and draft reply are wanted."
    };
  }

  const model = env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324";
  const prompt = [
    "You are preparing a private RFQ briefing for a Geneva physical energy trading desk.",
    "Do not reject the lead. Treat every enquiry as received. Provide preparation notes only.",
    "Return compact JSON with keys: summary, language, englishTranslation, prepBand, complianceReviewNotes, suggestedReply, suggestedQuestions.",
    "prepBand must be one of: ready-to-review, needs-clarification, verify-carefully.",
    "Never claim sanctions/KYC clearance. Say when human review is required.",
    "",
    "RFQ JSON:",
    JSON.stringify({ enquiry, deterministicBrief: brief }, null, 2)
  ].join("\n");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "content-type": "application/json",
        "http-referer": "https://petrair.org/",
        "x-title": "Petrair RFQ Lead Brief"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You create private salesperson prep notes for commodity RFQs. Output JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 900
      })
    });

    if (!response.ok) {
      return { enabled: true, ok: false, note: `AI request failed with HTTP ${response.status}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    return {
      enabled: true,
      ok: true,
      model,
      ...parseAiJson(content)
    };
  } catch (error) {
    return { enabled: true, ok: false, note: `AI prep failed: ${error.message}` };
  }
}

function parseAiJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
  }
  return { raw: content };
}

async function checkDomain(site) {
  if (!site) return { status: "no company website inferred", reachable: false };
  try {
    const response = await fetch(site, {
      method: "HEAD",
      redirect: "follow",
      cf: { cacheTtl: 3600, cacheEverything: true }
    });
    return {
      status: response.ok ? "inferred website responded" : `inferred website returned HTTP ${response.status}`,
      reachable: response.ok,
      finalUrl: response.url
    };
  } catch (error) {
    return { status: `website check failed: ${error.message}`, reachable: false };
  }
}

function inferCompanySite(emailDomain) {
  if (!emailDomain || FREE_EMAIL_DOMAINS.has(emailDomain)) return "";
  return `https://${emailDomain}/`;
}

async function sendWebhook(url, brief) {
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(brief)
  });
}

async function sendTelegram(botToken, chatId, brief) {
  const message = telegramText(brief);
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true
    })
  });
}

async function sendEmail(apiKey, brief, toEmail) {
  const subject = `Petrair RFQ lead brief - ${brief.lead.company || brief.lead.email || "new enquiry"}`;
  const body = briefToText(brief);
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: "Petrair Lead Brief <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      text: body
    })
  });
}

function briefToText(brief) {
  const lead = brief.lead;
  const research = brief.research;
  const prep = brief.salespersonPrep;
  return [
    "PETRAIR RFQ LEAD BRIEF",
    "",
    `Created: ${brief.createdAt}`,
    "",
    "Contact",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company}`,
    `Product: ${lead.product}`,
    `Quantity: ${lead.quantity}`,
    `Destination: ${lead.destination}`,
    "",
    "Message",
    lead.message,
    "",
    "Research",
    `Email domain: ${lead.emailDomain}`,
    `Domain type: ${research.emailDomainType}`,
    `Inferred website: ${research.inferredCompanyWebsite}`,
    `Website check: ${research.websiteCheck.status}`,
    "",
    "Search Links",
    ...Object.entries(research.searchLinks).map(([key, value]) => `${key}: ${value}`),
    "",
    "Salesperson Prep",
    prep.summary,
    "",
    "Notes",
    ...prep.notes.map((note) => `- ${note}`),
    "",
    "Suggested Questions",
    ...prep.suggestedQuestions.map((question) => `- ${question}`),
    "",
    "Reply Angle",
    prep.replyAngle,
    "",
    "AI Prep",
    brief.ai?.enabled ? JSON.stringify(brief.ai, null, 2) : brief.ai?.note || "Not enabled"
  ].join("\n");
}

function telegramText(brief) {
  const lead = brief.lead;
  const ai = brief.ai || {};
  const aiSummary = ai.summary || ai.note || "AI prep not enabled";
  const band = ai.prepBand || "manual-review";
  return [
    "Petrair RFQ lead brief",
    "",
    `Prep: ${band}`,
    `Product: ${lead.product || "Not supplied"}`,
    `Company: ${lead.company || "Not supplied"}`,
    `Contact: ${lead.name || "Not supplied"} <${lead.email || "no email"}>`,
    `Quantity: ${lead.quantity || "Not supplied"}`,
    `Destination: ${lead.destination || "Not supplied"}`,
    "",
    `Summary: ${aiSummary}`,
    "",
    `Website: ${brief.research.inferredCompanyWebsite || "Not inferred"}`,
    `Domain: ${brief.research.emailDomainType}`,
    "",
    "Questions:",
    ...(ai.suggestedQuestions || brief.salespersonPrep.suggestedQuestions).slice(0, 4).map((question) => `- ${question}`),
    "",
    "Preparation only. Not KYC or sanctions clearance."
  ].join("\n").slice(0, 3900);
}

function searchUrl(query) {
  const value = clean(query);
  return value ? `https://www.google.com/search?q=${encodeURIComponent(value)}` : "";
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}
