import { useState } from "react";
import type { UserLink } from "../api/url.api";
import { buildShortUrl } from "../utils/axios";

interface LinkCardProps {
  link: UserLink;
  isDeleting: boolean;
  onDelete: (code: string) => Promise<void>;
}

const LinkCard = ({ link, isDeleting, onDelete }: LinkCardProps) => {
  const [copied, setCopied] = useState(false);
  const shortUrl = buildShortUrl(link.shortCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 shadow-lg shadow-slate-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Short Link</p>
          <a
            className="mt-2 block break-all text-lg font-semibold text-white underline decoration-emerald-300/40 underline-offset-4"
            href={shortUrl}
            rel="noreferrer"
            target="_blank"
          >
            {shortUrl}
          </a>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Original URL</p>
          <p className="mt-2 break-all text-sm leading-6 text-slate-300">{link.originalUrl}</p>
        </div>

        <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p>Created</p>
          <p className="mt-1 font-medium text-white">
            {new Date(link.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          type="button"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => onDelete(link.shortCode)}
          disabled={isDeleting}
          type="button"
          className="rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-wait disabled:opacity-70"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default LinkCard;
