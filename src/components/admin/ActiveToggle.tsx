"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Shared "Hide / Show" button for products and "Disable / Enable" for codes. */
export default function ActiveToggle({ url, active, on, off }: { url: string; active: boolean; on: string; off: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) });
    setBusy(false);
    router.refresh();
  }

  return (
    <button type="button" onClick={toggle} disabled={busy} className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-50">
      {active ? off : on}
    </button>
  );
}
