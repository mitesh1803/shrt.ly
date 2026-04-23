import { Link } from "react-router-dom";
import Navbar from "../components/navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-4xl items-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-[2rem] border border-white/10 bg-white/6 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Page not found</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            The page you requested does not exist or has moved. Go back home to create and manage
            short links.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Go to homepage
          </Link>
        </section>
      </main>
    </div>
  );
};

export default NotFound;
