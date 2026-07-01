import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { healthRoutes } from "./modules/health/health.route";

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

app.route("/api/v1/health", healthRoutes);

serve({ fetch: app.fetch, port }, () => {});
