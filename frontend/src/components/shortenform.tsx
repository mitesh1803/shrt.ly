import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { shortenUrl } from "../api/url.api";
import { useAuth } from "../authContext";

const normalizeUrl = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error("Enter a URL to shorten.");
  }

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  return new URL(candidate).toString();
};

const ShortenForm = () => {
  const { isLoggedIn } = useAuth();
  const extensionDownloadUrl = import.meta.env.VITE_EXTENSION_DOWNLOAD_URL || "/chrome-extension";
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const normalizedUrl = normalizeUrl(url);

      setLoading(true);
      setError("");
      setCopied(false);

      const nextShortUrl = await shortenUrl(normalizedUrl);
      setUrl(normalizedUrl);
      setShortUrl(nextShortUrl);
    } catch (error) {
      if (error instanceof Error && !axios.isAxiosError(error)) {
        setError(error.message);
      } else if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Could not shorten that URL.");
      } else {
        setError("Could not shorten that URL.");
      }

      setShortUrl("");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
    } catch {
      setError("Clipboard access failed. Copy the link manually.");
    }
  };

  return (
    <section>
      <form
        onSubmit={handleShorten}
        className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">
              Shorten Any Link
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Paste it once. Share it everywhere.
            </h2>
          </div>
          <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200 sm:block">
            {isLoggedIn ? "Saved to dashboard" : "Guest mode"}
          </div>
        </div>

        <label className="mb-3 block text-sm font-medium text-slate-300" htmlFor="url">
          Long URL
        </label>

        <div className="flex flex-col gap-3">
          <input
            id="url"
            type="text"
            required
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError("");
            }}
            placeholder="https://example.com/some/very/long/link"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/30"
          />
          <button
            disabled={loading}
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 px-5 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Creating short link..." : "Shorten URL"}
          </button>
        </div>

        <p className="mt-4 min-h-6 text-sm text-rose-300">{error}</p>

        {shortUrl ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Ready</p>
            <a
              className="mt-2 block break-all text-lg font-medium text-white underline decoration-emerald-300/40 underline-offset-4"
              href={shortUrl}
              rel="noreferrer"
              target="_blank"
            >
              {shortUrl}
            </a>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCopy}
                type="button"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                href={shortUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open link
              </a>
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-white">Need the browser add-on?</p>
          <a
            className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            href="extension.zip"
            download="url-shortener-extension.zip"
            rel="noreferrer"
            target="_blank"
          >
            Download Extension
          </a>
          <Link
            className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            to={isLoggedIn ? "/dashboard" : "/register"}
          >
            {isLoggedIn ? "Open dashboard" : "Register now"}
          </Link>
        </div>
      </form>
    </section>
  );
};

export default ShortenForm;
