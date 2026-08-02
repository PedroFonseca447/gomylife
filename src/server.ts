import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./utils/prisma.client.js";

const port = Number(process.env.PORT ?? 3333);
const server = app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));