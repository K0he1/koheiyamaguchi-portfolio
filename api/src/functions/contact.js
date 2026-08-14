import { app } from "@azure/functions";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;

function jsonResponse(body, status = 200) {
  return {
    status,
    headers: { "Content-Type": "application/json" },
    jsonBody: body,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
}

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Gmail credentials are not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Gmail token request failed with status ${response.status}.`);
  }

  const body = await response.json();
  if (!body.access_token) {
    throw new Error("Gmail access token was not returned.");
  }

  return body.access_token;
}

async function sendContactEmail({ name, email, message }) {
  const recipient = process.env.CONTACT_TO_EMAIL;
  if (!recipient || !isValidEmail(recipient)) {
    throw new Error("Contact recipient is not configured.");
  }

  const accessToken = await getAccessToken();
  const rawMessage = [
    `From: ${recipient}`,
    `To: ${recipient}`,
    `Reply-To: ${email}`,
    "Subject: Portfolio contact form",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\r\n");

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: toBase64Url(rawMessage) }),
  });

  if (!response.ok) {
    throw new Error(`Gmail send request failed with status ${response.status}.`);
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

    try {
      await sendContactEmail({ name, email, message });
      return jsonResponse({ message: "お問い合わせを受け付けました。" });
    } catch (error) {
      context.error("Contact email delivery failed.", error);
      return jsonResponse({ message: "現在送信できません。時間を置いて再度お試しください。" }, 503);
    }
  },
});
