import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  // Kita tarik link koneksi dari .env
  const connectionString = process.env.DATABASE_URL;

  // Bikin pool koneksi pakai pg
  const pool = new Pool({ connectionString });

  // Pasang pool-nya ke adapter Prisma
  const adapter = new PrismaPg(pool);

  // Masukin adapter ke dalam PrismaClient
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
