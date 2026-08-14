import { app } from "@azure/functions";
import { EmailClient } from "@azure/communication-email";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_WINDOW_MS = 30 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map();

function jsonResponse(body, status = 200, additionalHeaders = {}) {
  return {
    status,
    headers: { "Content-Type": "application/json", ...additionalHeaders },
    jsonBody: body,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = request.headers.get("x-client-ip");
  return (forwardedFor?.split(",")[0] ?? clientIp ?? "unknown").trim() || "unknown";
}

function checkRateLimit(clientIp, now = Date.now()) {
  for (const [key, entry] of rateLimitStore) {
    if (now >= entry.windowStartedAt + RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(clientIp);

  if (!current || now >= current.windowStartedAt + RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientIp, { count: 1, windowStartedAt: now });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((current.windowStartedAt + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  current.count += 1;
  return { allowed: true };
}

async function sendContactEmail({ name, email, message }) {
  const recipient = process.env.CONTACT_TO_EMAIL;
  const sender = process.env.ACS_SENDER_ADDRESS;
  const connectionString = process.env.ACS_EMAIL_CONNECTION_STRING;

  if (!recipient || !isValidEmail(recipient) || !sender || !isValidEmail(sender)) {
    throw new Error("Contact recipient is not configured.");
  }

  if (!connectionString) {
    throw new Error("Azure Communication Services credentials are not configured.");
  }

  const emailClient = new EmailClient(connectionString);
  const poller = await emailClient.beginSend({
    senderAddress: sender,
    recipients: { to: [{ address: recipient }] },
    replyTo: [{ address: email }],
    content: {
      subject: "Portfolio contact form",
      plainText: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
    },
  });
  const result = await poller.pollUntilDone();

  if (result.status !== "Succeeded") {
    throw new Error(`Azure Communication Services email failed with status ${result.status}.`);
  }
}

app.http("contact", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "contact",
  handler: async (request, context) => {
    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "入力内容を確認してください。" }, 400);
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const website = typeof body?.website === "string" ? body.website.trim() : "";

    if (website) {
      return jsonResponse({ message: "送信できませんでした。" }, 400);
    }

    if (!name || name.length > MAX_NAME_LENGTH || !isValidEmail(email) || !message || message.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse({ message: "入力内容を確認してください。" }, 400);
    }

    const rateLimit = checkRateLimit(getClientIp(request));
    if (!rateLimit.allowed) {
      return jsonResponse(
        { message: "送信回数の上限に達しました。時間を置いて再度お試しください。" },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }

    try {
      await sendContactEmail({ name, email, message });
      return jsonResponse({ message: "お問い合わせを受け付けました。" });
    } catch (error) {
      context.error("Contact email delivery failed.", error);
      return jsonResponse({ message: "現在送信できません。時間を置いて再度お試しください。" }, 503);
    }
  },
});
