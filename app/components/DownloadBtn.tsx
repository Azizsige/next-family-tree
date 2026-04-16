"use client";

// Import fitView biar bisa nge-zoom otomatis
import { useReactFlow } from "@xyflow/react";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";

export default function DownloadBtn() {
  // Ambil senjata fitView dari React Flow
  const { getNodes, fitView } = useReactFlow();

  const handleDownload = () => {
    const toastId = toast.loading("Memotret silsilah secara menyeluruh...");

    const nodes = getNodes();
    if (nodes.length === 0) {
      toast.error("Data silsilah kosong!", { id: toastId });
      return;
    }

    // 1. TRIK RAHASIA: Paksa kanvas nge-zoom dan nengahin SEMUA kartu di layar
    fitView({ padding: 0.2, duration: 0 });

    // 2. Beri jeda 150ms agar posisi layar mapan sebelum difoto
    setTimeout(() => {
      // 3. Kita foto BUNGKUS UTAMA-nya (.react-flow), bukan viewport-nya!
      const container = document.querySelector(".react-flow") as HTMLElement;
      if (!container) {
        toast.error("Kanvas tidak ditemukan", { id: toastId });
        return;
      }

      toPng(container, {
        backgroundColor: "#f8fafc",
        pixelRatio: 3, // Bikin resolusi 3x lipat (Super HD/4K) biar tajam
        filter: (node) => {
          // Sembunyikan tombol +/- (Controls) bawaan React Flow biar gak ikut kefoto
          if (node?.classList?.contains("react-flow__controls")) {
            return false;
          }
          return true;
        },
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `Silsilah-Keluarga-${new Date().getTime()}.png`;
          link.href = dataUrl;
          link.click();
          toast.success("Gambar Full berhasil diunduh!", { id: toastId });
        })
        .catch((err) => {
          toast.error("Gagal memproses gambar.", { id: toastId });
          console.error("Export Error:", err);
        });
    }, 150);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-400 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Export PNG Full
    </button>
  );
}
