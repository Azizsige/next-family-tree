import { Suspense } from "react";
import { getFamilyMembers } from "@/app/actions/family";
import AdminForm from "@/app/components/AdminForm";
import DeleteBtn from "@/app/components/DeleteBtn";
import Link from "next/link";

// Tambahin searchParams biar page ini tau kalau URL-nya ada ?editId=...
export default async function AdminPage({
  searchParams,
}: {
  searchParams: { editId?: string };
}) {
  const res = await getFamilyMembers();
  const familyMember = res.success ? res.data : [];

  // Cari data orang yang lagi mau diedit berdasarkan URL
  const editData = searchParams.editId
    ? familyMember?.find(
        (m: any) => String(m.id) === String(searchParams.editId),
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Panel Admin Silsilah
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Kelola data anggota keluarga dan relasi secara dinamis.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {/* Tombol Rahasia Seeder */}
            <form
              action={async () => {
                "use server";
                const { generateDummyData } =
                  await import("@/app/actions/family");
                await generateDummyData();
              }}
            >
              <button
                type="submit"
                className="text-xs bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                🧪 Inject Dummy Data
              </button>
            </form>
            <div className="mt-4 md:mt-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100">
              Total: {familyMember?.length || 0} Data
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            {/* Lempar data edit ke dalam Form */}
            <Suspense fallback={<div>Loading...</div>}>
              <AdminForm familyMember={familyMember || []} />
            </Suspense>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                Daftar Anggota Keluarga
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 font-semibold">Nama Lengkap</th>
                    <th className="p-4 font-semibold">Gender</th>
                    <th className="p-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {familyMember?.map((member: any) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-700">
                        {member.name}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-bold ${member.gender === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
                        >
                          {member.gender === "L" ? "Laki-laki" : "Perempuan"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {/* Tombol Edit pakai Link buat ngubah URL jadi ?editId=xxx */}
                        <Link
                          href={`/admin?editId=${member.id}`}
                          className="text-amber-500 hover:text-amber-700 font-medium px-2 py-1 bg-amber-50 rounded-md transition-colors text-xs inline-block"
                        >
                          Edit
                        </Link>
                        {/* Panggil komponen Hapus */}
                        <DeleteBtn id={member.id} />
                      </td>
                    </tr>
                  ))}
                  {familyMember?.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-slate-400 italic"
                      >
                        Belum ada data keluarga yang ditambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
