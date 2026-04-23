import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteLink, getMyLinks, type UserLink } from "../api/url.api";
import { useAuth } from "../authContext";
import LinkCard from "../components/linkCard";
import Navbar from "../components/navbar";

const Dashboard = () => {
  const { email, logout } = useAuth();
  const [links, setLinks] = useState<UserLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchLinks = async () => {
      try {
        const nextLinks = await getMyLinks();

        if (!ignore) {
          setLinks(nextLinks);
          setError("");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          return;
        }

        if (!ignore) {
          setError("We could not load your links right now.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchLinks();

    return () => {
      ignore = true;
    };
  }, [logout]);

  const handleDelete = async (code: string) => {
    try {
      setDeletingCode(code);
      setError("");
      await deleteLink(code);
      setLinks((currentLinks) => currentLinks.filter((link) => link.shortCode !== code));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
        return;
      }

      setError("Delete failed. Please try again.");
    } finally {
      setDeletingCode(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.9))] px-6 py-8 shadow-2xl shadow-slate-950/50">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                Your saved links
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                {email ? `Signed in as ${email}. ` : ""}
                Everything you shorten while logged in shows up here for quick reuse and cleanup.
              </p>
            </div>

            <Link
              className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              to="/"
            >
              Create another short link
            </Link>
          </div>
        </section>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-10 text-center text-slate-300">
              Loading your links...
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-[2rem] border border-rose-300/20 bg-rose-400/10 p-5 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {!loading && !error && links.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-10 text-center">
              <p className="text-lg font-medium text-white">No links yet</p>
              <p className="mt-2 text-slate-400">
                Shorten your first URL from the homepage and it will appear here.
              </p>
              <Link
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                to="/"
              >
                Go to homepage
              </Link>
            </div>
          ) : null}

          {!loading && links.length > 0 ? (
            <div className="grid gap-4">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  isDeleting={deletingCode === link.shortCode}
                  link={link}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
