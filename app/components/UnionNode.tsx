import { Handle, Position } from "@xyflow/react";

export default function UnionNode() {
  return (
    <div className="w-5 h-5 rounded-full bg-indigo-500 border-4 border-white shadow-md flex items-center justify-center relative z-10">
      {/* Handle Atas (Buat nerima garis horizontal dari Suami & Istri) */}
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0" // Kita bikin tembus pandang biar buletannya tetep estetik
      />

      {/* Handle Bawah (Buat narik garis vertikal turun ke Anak) */}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
