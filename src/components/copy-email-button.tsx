"use client";

import { useState } from "react";

type CopyEmailButtonProps = {
  email: string;
};

export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopyEmail}
      className="inline-flex cursor-pointer border border-black px-6 py-4 text-xs uppercase tracking-[0.28em] transition-colors hover:bg-black hover:text-[#f7f4ee]"
    >
      {copied ? "已复制" : email}
    </button>
  );
}
