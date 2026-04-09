import { PrismaClient } from "@prisma/client";
import { envs } from "../../config/envs.js";
import { PrismaPg } from "@prisma/adapter-pg";



const connectionString = `${envs.POSTGRES_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };