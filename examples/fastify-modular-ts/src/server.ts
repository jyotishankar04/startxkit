import "dotenv/config";
import Fastify from "fastify";
import { healthRoutes } from "./modules/health/health.route";

const app = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 3000);

app.register(healthRoutes, { prefix: "/api/v1/health" });

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
