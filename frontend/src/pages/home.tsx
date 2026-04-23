import { Link } from "react-router-dom";
import { useAuth } from "../authContext";
import Navbar from "../components/navbar";
import ShortenForm from "../components/shortenform";

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] px-6 py-10 shadow-2xl shadow-slate-950/50 sm:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-200/80">
              Your Own URL Shortener
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Short links that stay inside your stack.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Generate clean shareable links, save them to your account, and manage everything from
              one dashboard or the Chrome extension.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                to={isLoggedIn ? "/dashboard" : "/register"}
              >
                {isLoggedIn ? "Open dashboard" : "Create account"}
              </Link>
              <Link
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                to="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <ShortenForm />
        </div>
      </main>
    </div>
  );
};

export default Home;
