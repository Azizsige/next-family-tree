"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false, error: "Email atau Password salah!" };
  }

  // Set session cookie (simpel buat MVP)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 hari
    path: "/",
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}

// Tambahin di baris paling bawah app/actions/auth.ts
export async function createInitialAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Pake upsert biar kalau diklik berkali-kali nggak error (kalau udah ada, dibiarin)
    await prisma.user.upsert({
      where: { email: "admin@admin.com" },
      update: {},
      create: {
        email: "admin@admin.com",
        password: hashedPassword,
      },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
