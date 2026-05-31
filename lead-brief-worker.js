const VERSION = "petrair-lead-brief-2026-05-31-v1";

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

    const brief = await buildLeadBrief(enquiry);

    if (env.LEAD_WEBHOOK_URL) {
      await sendWebhook(env.LEAD_WEBHOOK_URL, brief);
    }

    if (env.RESEND_API_KEY) {
      await sendEmail(env.RESEND_API_KEY, brief, env.LEAD_TO_EMAIL || DEFAULT_LEAD_EMAIL);
    }

    return json({ ok: true, version: VERSION }, 200);
  }
};

async function buildLeadBrief(enquiry) {
  const email = clean(enquiry.Email);
  const emailDomain = email.includes("@") ? email.split("@").pop().toLowerCase() : "";
  const company = clean(enquiry.Company);
  const product = clean(enquiry.Product);
  const message = clean(enquiry.Message);
  const inferredSite = inferCompanySite(emailDomain);
  const domainInfo = await checkDomain(inferredSite);
  const notes = buildPreparationNotes({ enquiry, emailDomain, company, product, message, domainInfo });

  return {
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
    notes.push("For ULSD/EN590, verify sulphur basis, destination, monthly schedule, inspection location and whether pricing is index-linked.");
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
    prep.replyAngle
  ].join("\n");
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
