"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="wrap py-12">
      <p className="eyebrow">Get in touch</p>
      <h1 className="display mt-2 text-4xl font-bold sm:text-5xl">Contact us</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", text: "hello@nextshop.example" },
            { icon: Clock, title: "Support hours", text: "Mon–Fri, 9am–6pm" },
            { icon: MapPin, title: "Studio", text: "Antigua Guatemala" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card flex items-center gap-4 p-5">
              <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-accent"><Icon className="size-5" /></span>
              <div><p className="text-sm font-semibold">{title}</p><p className="text-sm text-muted">{text}</p></div>
            </div>
          ))}
        </div>

        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="grid place-items-center gap-3 py-16 text-center">
              <CheckCircle2 className="size-12 text-accent" />
              <p className="display text-2xl font-semibold">Message sent</p>
              <p className="text-muted">Demo form: nothing was actually sent.</p>
              <button className="btn-ghost mt-2" onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="c-name" className="label">Name</label><input id="c-name" required className="field" /></div>
              <div><label htmlFor="c-email" className="label">Email</label><input id="c-email" type="email" required className="field" /></div>
              <div className="sm:col-span-2"><label htmlFor="c-msg" className="label">Message</label><textarea id="c-msg" required rows={6} className="field resize-none" /></div>
              <button className="btn-primary sm:col-span-2">Send message</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
