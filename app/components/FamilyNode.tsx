import { Handle, Position } from "@xyflow/react";

export default function FamilyNode({ data }: { data: any }) {
  // Tentukan tema warna berdasarkan gender
  const isMale = data.gender === "L";
  const theme = isMale
    ? {
        border: "border-blue-300",
        bg: "bg-blue-50",
        text: "text-blue-600",
        shadow: "shadow-blue-100/50",
        handle: "border-blue-500",
      }
    : {
        border: "border-pink-300",
        bg: "bg-pink-50",
        text: "text-pink-600",
        shadow: "shadow-pink-100/50",
        handle: "border-pink-500",
      };

  const isRoot = data.relationLabel === "Pusat Silsilah";

  return (
    <div
      className={`relative px-5 py-4 bg-white rounded-2xl border-2 ${isRoot ? "border-amber-400 shadow-amber-200/50" : theme.border} shadow-lg ${theme.shadow} min-w-[220px] transition-all hover:-translate-y-1 hover:shadow-xl cursor-grab active:cursor-grabbing`}
    >
      {/* BADGE RELASI MUNCUL DI SINI (Pojok Kanan Atas) */}
      {data.relationLabel && (
        <div
          className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-white ${isRoot ? "bg-amber-500 text-white" : "bg-slate-800 text-white"}`}
        >
          {data.relationLabel}
        </div>
      )}

      {/* Sisa kode lu yang lama biarin sama aja */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3.5 h-3.5 bg-white border-2 ${theme.handle} rounded-full`}
      />

      <div className="flex items-center gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold ${theme.bg} ${theme.text}`}
        >
          {data.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-bold text-slate-800 text-lg leading-tight">
            {data.name}
          </h3>
          <span
            className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${theme.text}`}
          >
            {isMale ? "Laki-laki" : "Perempuan"}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3.5 h-3.5 bg-white border-2 ${theme.handle} rounded-full`}
      />
    </div>
  );
}
