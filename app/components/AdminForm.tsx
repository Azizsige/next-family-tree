"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { addFamilyMember, updateFamilyMember } from "@/app/actions/family";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // <-- Tambahan baru

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 huruf"),
  gender: z.enum(["L", "P"]).refine((val) => val, "Pilih jenis kelamin"),
  fatherId: z.string().optional().nullable(),
  motherId: z.string().optional().nullable(),
  spouseId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

// Hapus props editData, kita cari langsung di dalam komponen ini
export default function AdminForm({ familyMember }: { familyMember: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Ambil URL secara langsung di sisi Client
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  // 2. Cocokin ID dari URL sama data familyMember
  const editData = editId
    ? familyMember.find((m: any) => String(m.id) === String(editId))
    : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  // 3. Masukin data otomatis pas editData dapet isinya
  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        gender: editData.gender,
        fatherId: editData.fatherId || "",
        motherId: editData.motherId || "",
        spouseId: editData.spouseId || "",
      });
    } else {
      reset({
        name: "",
        gender: undefined,
        fatherId: "",
        motherId: "",
        spouseId: "",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    // 1. KITA CUCI DATANYA DI SINI BRO!
    // Kalau value-nya string kosong "", kita paksa ubah jadi null
    const cleanedData = {
      ...data,
      fatherId: data.fatherId === "" ? null : data.fatherId,
      motherId: data.motherId === "" ? null : data.motherId,
      spouseId: data.spouseId === "" ? null : data.spouseId,
    };

    // 2. Lempar data yang udah bersih (cleanedData) ke database
    let res;
    if (editData) {
      res = await updateFamilyMember(editData.id, cleanedData); // <--- Pakai cleanedData
    } else {
      res = await addFamilyMember(cleanedData); // <--- Pakai cleanedData
    }

    setLoading(false);

    if (res.success) {
      toast.success(
        editData ? "Data berhasil diupdate!" : "Data berhasil ditambahkan!",
      );
      router.push("/admin");
      if (!editData) reset();
    } else {
      toast.error("Gagal: " + res.error);
    }
  };

  const males = familyMember.filter(
    (m) => m.gender === "L" && m.id !== editData?.id,
  );
  const females = familyMember.filter(
    (m) => m.gender === "P" && m.id !== editData?.id,
  );
  const validSpouses = familyMember.filter((m) => m.id !== editData?.id);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-5 text-slate-800 relative"
    >
      {editData && (
        <button
          type="button"
          onClick={() => router.push("/admin")} // Tombol batal
          className="absolute top-6 right-6 text-sm text-slate-400 hover:text-slate-600 underline"
        >
          Batal Edit
        </button>
      )}

      <div className="border-b border-slate-100 pb-4 mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {editData ? "Edit Data Keluarga" : "Tambah Anggota Baru"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {editData
            ? `Mengubah data milik ${editData.name}`
            : "Lengkapi form di bawah untuk menambah silsilah."}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-700">
          Nama Lengkap
        </label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-slate-400"
          placeholder="Masukkan nama lengkap"
        />
        {errors.name && (
          <p className="text-red-500 text-xs font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-700">
          Jenis Kelamin
        </label>
        <select
          {...register("gender")}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
        >
          <option value="" className="text-slate-400">
            -- Pilih Gender --
          </option>
          <option value="L">Laki-laki (L)</option>
          <option value="P">Perempuan (P)</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs font-medium">
            {errors.gender.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Ayah <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <select
            {...register("fatherId")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
          >
            <option value="">-- Tidak Ada --</option>
            {males.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Ibu <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <select
            {...register("motherId")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
          >
            <option value="">-- Tidak Ada --</option>
            {females.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5 pb-2">
        <label className="block text-sm font-semibold text-slate-700">
          Pasangan{" "}
          <span className="text-slate-400 font-normal">(Suami/Istri)</span>
        </label>
        <select
          {...register("spouseId")}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
        >
          <option value="">-- Belum Menikah --</option>
          {validSpouses.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed mt-2 ${editData ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading
          ? "Menyimpan Data..."
          : editData
            ? "Update Data"
            : "Simpan Data Keluarga"}
      </button>
    </form>
  );
}
