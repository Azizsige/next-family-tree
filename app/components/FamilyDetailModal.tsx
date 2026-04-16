"use client";

export default function FamilyDetailModal({
  isOpen,
  onClose,
  member,
  allMembers,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  allMembers: any[];
}) {
  if (!isOpen || !member) return null;

  // --- LOGIKA PENCARIAN RELASI OTOMATIS ---
  // Cari Orang Tua
  const father = allMembers.find((m) => m.id === member.fatherId);
  const mother = allMembers.find((m) => m.id === member.motherId);

  // Cari Pasangan (Bisa dia yang nyimpen spouseId, atau pasangannya yang nyimpen ID dia)
  const spouse = allMembers.find(
    (m) => m.id === member.spouseId || m.spouseId === member.id,
  );

  // Cari Saudara Kandung (Punya bapak atau ibu yang sama, tapi bukan dirinya sendiri)
  const siblings = allMembers.filter(
    (m) =>
      m.id !== member.id &&
      ((member.fatherId && m.fatherId === member.fatherId) ||
        (member.motherId && m.motherId === member.motherId)),
  );

  // Cari Anak (Yang fatherId atau motherId-nya adalah ID orang ini)
  const children = allMembers.filter(
    (m) => m.fatherId === member.id || m.motherId === member.id,
  );

  // Fungsi kecil buat nampilin badge Laki/Perempuan
  const GenderBadge = ({ gender }: { gender: string }) => (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ml-2 ${gender === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
    >
      {gender === "L" ? "L" : "P"}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 relative">
        {/* Tombol Close di Pojok */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Header Profil Utama */}
        <div
          className={`p-6 border-b-4 ${member.gender === "L" ? "border-blue-400" : "border-pink-400"} bg-slate-50`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold shadow-sm ${member.gender === "L" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}`}
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {member.name}
              </h2>
              <p
                className={`text-sm font-semibold mt-0.5 ${member.gender === "L" ? "text-blue-600" : "text-pink-600"}`}
              >
                {member.gender === "L" ? "Laki-laki" : "Perempuan"}
              </p>
            </div>
          </div>
        </div>

        {/* List Silsilah (Hasil Kalkulasi) */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-sm">
          {/* Orang Tua */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Orang Tua
            </h4>
            {father || mother ? (
              <div className="text-slate-700 font-medium">
                {father ? (
                  <p>
                    {father.name} <GenderBadge gender="L" />
                  </p>
                ) : null}
                {mother ? (
                  <p>
                    {mother.name} <GenderBadge gender="P" />
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-slate-400 italic">Tidak ada data orang tua.</p>
            )}
          </div>

          {/* Pasangan */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Pasangan Suami/Istri
            </h4>
            {spouse ? (
              <p className="text-slate-700 font-medium">
                {spouse.name} <GenderBadge gender={spouse.gender} />
              </p>
            ) : (
              <p className="text-slate-400 italic">
                Belum menikah / tidak ada data.
              </p>
            )}
          </div>

          {/* Saudara Kandung */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Saudara Kandung
            </h4>
            {siblings.length > 0 ? (
              <ul className="list-disc list-inside text-slate-700 font-medium">
                {siblings.map((s) => (
                  <li key={s.id}>
                    {s.name} <GenderBadge gender={s.gender} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 italic">Tidak ada data saudara.</p>
            )}
          </div>

          {/* Anak */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Anak
            </h4>
            {children.length > 0 ? (
              <ul className="list-disc list-inside text-slate-700 font-medium">
                {children.map((c) => (
                  <li key={c.id}>
                    {c.name} <GenderBadge gender={c.gender} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 italic">Tidak ada data anak.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
