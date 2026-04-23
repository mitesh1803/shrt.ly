import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../authContext";

const getNavClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-400 text-slate-950"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

const Navbar = () => {
  const { email, isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-400 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20">
            s
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              shrt<span className="text-emerald-400">.ly</span>
            </p>
            <p className="text-xs text-slate-400">Fast links, clean dashboard</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 lg:inline-flex">
                {email || "Signed in"}
              </span>
              <NavLink to="/dashboard" className={getNavClassName}>
                Dashboard
              </NavLink>
              <button
                onClick={logout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavClassName}>
                Login
              </NavLink>
              <NavLink to="/register" className={getNavClassName}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
