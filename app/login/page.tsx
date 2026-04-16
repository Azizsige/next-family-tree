"use client";

import { useTransition } from "react"; // <-- 1. Import useTransition
import { login, createInitialAdmin } from "@/app/actions/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  // 2. Ganti useState jadi useTransition
  const [isPending, startTransition] = useTransition();

  // Nggak perlu async di sini, karena async-nya pindah ke dalam startTransition
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 3. Bungkus Server Action pakai startTransition
    startTransition(async () => {
      const res = await login(formData);

      // Kalau gagal, munculin toast.
      // Kalau sukses, biarin aja muter karena Next.js bakal otomatis redirect ke /admin
      if (!res.success) {
        toast.error(res.error || "Login Gagal");
      }
    });
  }

  async function handleInject() {
    const res = await createInitialAdmin();
    if (res.success) {
      toast.success("Akun admin berhasil disuntik!");
    } else {
      toast.error("Gagal: " + res.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-sm text-slate-500 mt-2">
              Masuk untuk mengelola silsilah keluarga
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="admin@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Ganti variabel 'loading' jadi 'isPending' */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:bg-blue-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="4"
                      className="opacity-25"
                    ></circle>
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      className="opacity-75"
                    ></path>
                  </svg>
                  Mengecek...
                </>
              ) : (
                "Masuk ke Panel Admin"
              )}
            </button>
          </form>

          {/* TOMBOL RAHASIA BUAT BIKIN AKUN (HAPUS NANTI) */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={handleInject}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-lg transition-all"
            >
              🛠️ Inject Akun Admin (admin@admin.com / admin123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
