"use client";

import { useState } from "react";
import { deleteFamilyMember } from "@/app/actions/family";
import toast from "react-hot-toast";

export default function DeleteBtn({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State buat buka-tutup modal

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteFamilyMember(id);
    setLoading(false);

    if (!res.success) {
      toast.error(res.error || "Terjadi kesalahan saat menghapus data");
      setIsOpen(false); // Tutup modal kalau gagal
    } else {
      toast.success("Data berhasil dihapus!");
      setIsOpen(false); // Tutup modal kalau sukses
    }
  };

  return (
    <>
      {/* Tombol Hapus (Pemicu) */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-500 hover:text-red-700 font-medium px-2 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors text-xs"
      >
        Hapus
      </button>

      {/* Modal / Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
          {/* Kotak Modal Premium */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              {/* Icon Warning Cakep */}
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Hapus Data Ini?
              </h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Tindakan ini tidak bisa dibatalkan. Pastikan data ini tidak
                sedang terhubung sebagai orang tua atau pasangan dari data lain.
              </p>
            </div>

            {/* Area Tombol Aksi */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus Data"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
