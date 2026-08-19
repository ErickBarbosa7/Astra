import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✅ Conexión a PostgreSQL establecida");

    app.listen(env.PORT, () => {
      console.log(`🚀 API corriendo en http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
}

void startServer();
