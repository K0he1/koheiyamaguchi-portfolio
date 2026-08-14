"use client";

import { FormEvent, useEffect, useState } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!cooldownUntil) {
      return;
    }

    const timer = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (cooldownUntil <= currentTime) {
        window.clearInterval(timer);
        setCooldownUntil(null);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  const cooldownSeconds = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - now) / 1000)) : 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cooldownSeconds > 0) {
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "送信に失敗しました。");
      }

      form.reset();
      setStatus("success");
      setCooldownUntil(Date.now() + 60_000);
      setNow(Date.now());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "送信に失敗しました。");
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-field">
        <label htmlFor="contact-name">お名前</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={100} required />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email">メールアドレス</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">お問い合わせ内容</label>
        <textarea id="contact-message" name="message" rows={7} maxLength={5000} required />
      </div>

      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="button contact-submit" type="submit" disabled={status === "sending" || cooldownSeconds > 0}>
        {status === "sending" ? "送信中…" : cooldownSeconds > 0 ? `再送信まで${cooldownSeconds}秒` : "送信する"}
      </button>

      <p className="contact-status" aria-live="polite" data-state={status}>
        {status === "success" && "お問い合わせを受け付けました。ありがとうございます。"}
        {status === "error" && errorMessage}
      </p>
    </form>
  );
}
