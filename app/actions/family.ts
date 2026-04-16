"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Fungsi buat narik SEMUA data (Buat ditampilin di tabel & dropdown)
export async function getFamilyMembers() {
  try {
    const members = await prisma.familyMember.findMany({
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: members };
  } catch (error) {
    console.error("Gagal narik data:", error);
    return { success: false, error: "Gagal mengambil data dari database" };
  }
}

// 2. Fungsi buat nambahin anggota keluarga baru
export async function addFamilyMember(data: {
  name: string;
  gender: string;
  fatherId?: string | null;
  motherId?: string | null;
  spouseId?: string | null;
}) {
  try {
    // Insert ke Supabase via Prisma
    const newMember = await prisma.familyMember.create({
      data: {
        name: data.name,
        gender: data.gender,
        fatherId: data.fatherId || null,
        motherId: data.motherId || null,
        spouseId: data.spouseId || null,
      },
    });

    // Ini PENTING: Biar Next.js otomatis nge-refresh halaman setelah data masuk
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, data: newMember };
  } catch (error) {
    console.error("Gagal simpan data:", error);
    return { success: false, error: "Gagal menyimpan data ke database" };
  }
}

// Fungsi Edit
export const updateFamilyMember = async (id: string, data: any) => {
  try {
    await prisma.familyMember.update({
      where: { id },
      data,
    });
    revalidatePath("/admin"); // Refresh data di panel admin
    revalidatePath("/"); // Refresh data di pohon silsilah
    return { success: true };
  } catch (error: any) {
    console.log("Gagal update data:", error);
    return { success: false, error: error.message };
  }
};

// Fungsi Hapus
export const deleteFamilyMember = async (id: string) => {
  try {
    await prisma.familyMember.delete({
      where: { id },
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    // Kalau error, biasanya karena dia masih jadi "Ayah/Ibu" dari anak lain (Constraint Database)
    return {
      success: false,
      error:
        "Gagal menghapus. Pastikan dia tidak memiliki relasi anak/pasangan sebelum dihapus.",
    };
  }
};

// Fungsi rahasia buat ngetes Tree besar
export const generateDummyData = async () => {
  try {
    // 1. Bersihin data lama dulu biar nggak numpuk (HATI-HATI)
    await prisma.familyMember.deleteMany();

    // 2. GENERASI 1 (Buyut)
    const kakekBuyut = await prisma.familyMember.create({
      data: { name: "Mbah Karto (Buyut)", gender: "L" },
    });
    const nenekBuyut = await prisma.familyMember.create({
      data: {
        name: "Mbah Ponem (Buyut)",
        gender: "P",
        spouseId: kakekBuyut.id,
      },
    });
    await prisma.familyMember.update({
      where: { id: kakekBuyut.id },
      data: { spouseId: nenekBuyut.id },
    });

    // 3. GENERASI 2 (Kakek/Nenek & Saudara)
    const kakek = await prisma.familyMember.create({
      data: {
        name: "Bambang (Kakek)",
        gender: "L",
        fatherId: kakekBuyut.id,
        motherId: nenekBuyut.id,
      },
    });
    const nenek = await prisma.familyMember.create({
      data: { name: "Sri (Nenek)", gender: "P", spouseId: kakek.id },
    });
    await prisma.familyMember.update({
      where: { id: kakek.id },
      data: { spouseId: nenek.id },
    });

    // Paman Tua (Adiknya Kakek, jomblo)
    await prisma.familyMember.create({
      data: {
        name: "Parto (Paman Tua)",
        gender: "L",
        fatherId: kakekBuyut.id,
        motherId: nenekBuyut.id,
      },
    });

    // 4. GENERASI 3 (Orang Tua & Tante/Om)
    const ayah = await prisma.familyMember.create({
      data: {
        name: "Budi (Ayah)",
        gender: "L",
        fatherId: kakek.id,
        motherId: nenek.id,
      },
    });
    const ibu = await prisma.familyMember.create({
      data: { name: "Siti (Ibu)", gender: "P", spouseId: ayah.id },
    });
    await prisma.familyMember.update({
      where: { id: ayah.id },
      data: { spouseId: ibu.id },
    });

    const bibi = await prisma.familyMember.create({
      data: {
        name: "Wati (Bibi)",
        gender: "P",
        fatherId: kakek.id,
        motherId: nenek.id,
      },
    });
    const paman = await prisma.familyMember.create({
      data: { name: "Tarjo (Paman)", gender: "L", spouseId: bibi.id },
    });
    await prisma.familyMember.update({
      where: { id: bibi.id },
      data: { spouseId: paman.id },
    });

    // 5. GENERASI 4 (Anak & Sepupu)
    await prisma.familyMember.create({
      data: {
        name: "Joko (Lu)",
        gender: "L",
        fatherId: ayah.id,
        motherId: ibu.id,
      },
    });
    await prisma.familyMember.create({
      data: {
        name: "Ayu (Adik)",
        gender: "P",
        fatherId: ayah.id,
        motherId: ibu.id,
      },
    });
    await prisma.familyMember.create({
      data: {
        name: "Bima (Sepupu)",
        gender: "L",
        fatherId: paman.id,
        motherId: bibi.id,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
