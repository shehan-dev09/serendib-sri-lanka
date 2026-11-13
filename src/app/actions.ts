"use server";

import { revalidatePath } from "next/cache";
import { DESTINATIONS } from "@/lib/data";
import type { FormState } from "@/lib/form";
import { insertMessage, insertNote, insertSubscriber } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(form: FormData, key: string, max: number): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function wholeNumber(form: FormData, key: string, min: number, max: number, fallback: number): number {
  const n = Number.parseInt(text(form, key, 6), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

export async function addNote(_prev: FormState, form: FormData): Promise<FormState> {
  // Honeypot: real visitors never see or fill this field.
  if (text(form, "website", 100)) return { ok: true, message: "Thank you — your note has been added." };

  const name = text(form, "name", 80);
  const country = text(form, "country", 80);
  const message = text(form, "message", 1000);
  const destination = text(form, "destination", 64) || "sri-lanka";
  const rating = wholeNumber(form, "rating", 1, 5, 0);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Tell us your name (at least 2 characters).";
  if (message.length < 10) errors.message = "Write at least a sentence — 10 characters or more.";
  if (rating < 1) errors.rating = "Choose a rating from 1 to 5.";
  if (destination !== "sri-lanka" && !DESTINATIONS.some((d) => d.slug === destination)) {
    errors.destination = "Choose a destination from the list.";
  }
  if (Object.keys(errors).length) return { ok: false, message: "Please check the highlighted fields.", errors };

  try {
    await insertNote({ name, country, message, destination, rating });
  } catch (error) {
    console.error("addNote failed", error);
    return { ok: false, message: "We couldn't save your note just now. Please try again in a moment." };
  }

  revalidatePath("/guestbook");
  if (destination !== "sri-lanka") revalidatePath(`/destinations/${destination}`);
  return { ok: true, message: "Thank you — your note is now on the page." };
}

export async function subscribe(_prev: FormState, form: FormData): Promise<FormState> {
  if (text(form, "website", 100)) return { ok: true, message: "You're on the list." };
  const email = text(form, "email", 200).toLowerCase();
  if (!EMAIL.test(email)) {
    return { ok: false, message: "Enter a valid email address.", errors: { email: "Enter a valid email address." } };
  }
  try {
    await insertSubscriber(email);
  } catch (error) {
    console.error("subscribe failed", error);
    return { ok: false, message: "We couldn't save that just now. Please try again." };
  }
  return { ok: true, message: "You're on the list. Istuti — thank you!" };
}

export async function sendMessage(_prev: FormState, form: FormData): Promise<FormState> {
  if (text(form, "website", 100)) return { ok: true, message: "Thank you — your message has been received." };

  const name = text(form, "name", 80);
  const email = text(form, "email", 200).toLowerCase();
  const message = text(form, "message", 2000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (message.length < 10) errors.message = "Write at least a sentence — 10 characters or more.";
  if (Object.keys(errors).length) return { ok: false, message: "Please check the highlighted fields.", errors };

  try {
    await insertMessage({ name, email, message });
  } catch (error) {
    console.error("sendMessage failed", error);
    return { ok: false, message: "We couldn't save your message just now. Please try again in a moment." };
  }
  return { ok: true, message: "Thank you — your message has been saved." };
}
