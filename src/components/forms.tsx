"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { addNote, sendMessage, subscribe } from "@/app/actions";
import { initialFormState, type FormState } from "@/lib/form";

type Action = (prev: FormState, form: FormData) => Promise<FormState>;

/** Submits to a server action while keeping what the visitor typed if validation fails. */
function useServerForm(action: Action, { refresh = false }: { refresh?: boolean } = {}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(async () => {
      try {
        const result = await action(initialFormState, data);
        setState(result);
        if (result.ok) {
          ref.current?.reset();
          // Re-fetch the server-rendered list so the new entry shows straight away.
          if (refresh) router.refresh();
        }
      } catch {
        setState({ ok: false, message: "Something went wrong sending the form. Check your connection and try again." });
      }
    });
  };

  return { state, pending, ref, onSubmit };
}

function Field({ label, name, error, hint, children }: { label: string; name: string; error?: string; hint?: string; children: (props: { id: string; name: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode }) {
  const id = useId();
  const describedBy = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block text-teak">
        {label}
      </label>
      {children({ id, name, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-e`} className="mt-1.5 text-sm font-medium text-lacquer">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-h`} className="mt-1.5 text-sm text-teak/80">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Status({ state, tone = "light" }: { state: FormState; tone?: "light" | "dark" }) {
  return (
    <p role="status" aria-live="polite" className={`min-h-6 text-base font-medium ${state.message ? "" : "sr-only"} ${state.ok ? (tone === "dark" ? "text-gold" : "text-leaf") : tone === "dark" ? "text-saffron" : "text-lacquer"}`}>
      {state.message}
    </p>
  );
}

function Honeypot() {
  return (
    <div className="absolute -left-[9999px]" aria-hidden="true">
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/* ---------------------------------------------------------------- Notes */

export function NoteForm({ destination, options }: { destination?: string; options?: { slug: string; name: string }[] }) {
  const { state, pending, ref, onSubmit } = useServerForm(addNote, { refresh: true });
  const e = state.errors ?? {};
  return (
    <form ref={ref} onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot />
      {destination ? (
        <input type="hidden" name="destination" value={destination} />
      ) : (
        <Field label="About" name="destination" error={e.destination}>
          {(p) => (
            <select {...p} className="field" defaultValue="sri-lanka">
              <option value="sri-lanka">Sri Lanka in general</option>
              {options?.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
        </Field>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={e.name}>
          {(p) => <input {...p} type="text" className="field" autoComplete="name" maxLength={80} required />}
        </Field>
        <Field label="Where you're from" name="country" hint="Optional">
          {(p) => <input {...p} type="text" className="field" autoComplete="country-name" maxLength={80} />}
        </Field>
      </div>
      <fieldset>
        <legend className="label mb-2 text-teak">Your rating</legend>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="rating" value={n} defaultChecked={n === 5} className="peer sr-only" />
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-clay bg-paper font-label text-lg font-bold text-teak transition-colors peer-checked:border-maroon peer-checked:bg-maroon peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-maroon">
                {n}
              </span>
              <span className="sr-only">{n === 1 ? "1 out of 5" : `${n} out of 5`}</span>
            </label>
          ))}
        </div>
        {e.rating && <p className="mt-1.5 text-sm font-medium text-lacquer">{e.rating}</p>}
      </fieldset>
      <Field label="Your note" name="message" error={e.message} hint="A tip, a favourite moment, something you wish you'd known.">
        {(p) => <textarea {...p} rows={4} className="field" maxLength={1000} required />}
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-maroon" disabled={pending}>
          {pending ? "Adding…" : "Add my note"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- Message */

export function MessageForm() {
  const { state, pending, ref, onSubmit } = useServerForm(sendMessage);
  const e = state.errors ?? {};
  return (
    <form ref={ref} onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={e.name}>
          {(p) => <input {...p} type="text" className="field" autoComplete="name" maxLength={80} required />}
        </Field>
        <Field label="Email" name="email" error={e.email}>
          {(p) => <input {...p} type="email" className="field" autoComplete="email" maxLength={200} required />}
        </Field>
      </div>
      <Field label="Your question" name="message" error={e.message} hint="Anything about the island — a place, a festival, a season, a photograph.">
        {(p) => <textarea {...p} rows={5} className="field" maxLength={2000} required />}
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-maroon" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- Newsletter */

export function NewsletterForm() {
  const { state, pending, ref, onSubmit } = useServerForm(subscribe);
  const id = useId();
  return (
    <form ref={ref} onSubmit={onSubmit} noValidate className="relative">
      <Honeypot />
      <label htmlFor={id} className="label block text-gold">
        Island letters
      </label>
      <p className="mt-2 text-paper/80">Seasonal notes on where to go next. Leave your email to join the list.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(state.errors?.email)}
          className="h-12 min-w-0 flex-1 rounded-full border-[1.5px] border-paper/40 bg-transparent px-5 text-paper placeholder:text-paper/55"
          required
        />
        <button type="submit" className="btn btn-saffron" disabled={pending}>
          {pending ? "Joining…" : "Join"}
        </button>
      </div>
      <div className="mt-3">
        <Status state={state} tone="dark" />
      </div>
    </form>
  );
}
