import axios from "axios";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { useAuth } from "../authContext";
import Navbar from "../components/navbar";

const Register = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate replace to="/dashboard" />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await registerUser(email.trim(), password);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Registration failed.");
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">Get started</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Create your shrt.ly account.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Save generated links, revisit them in the dashboard, and manage deletions without
              leaving your workspace.
            </p>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/50"
          >
            <h2 className="text-2xl font-semibold text-white">Register</h2>
            <p className="mt-2 text-sm text-slate-400">Use an email and password to create your account.</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/30"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-300"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/30"
                  placeholder="Choose a password"
                />
              </div>
            </div>

            <p className="mt-4 min-h-6 text-sm text-rose-300">{error}</p>

            <button
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 px-5 py-3 text-base font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="mt-6 text-sm text-slate-400">
              Already registered?{" "}
              <Link className="font-semibold text-emerald-300 hover:text-emerald-200" to="/login">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
