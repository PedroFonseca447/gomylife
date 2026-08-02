import express from "express";
import { errorMiddleware } from "./http/middlewares/error.middleware.js";
import { routes } from "./http/routes/index.js";
export const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
});
app.use(routes);
app.use((_request, response) => {
    response.status(404).json({ error: "Route not found" });
});
app.use(errorMiddleware);
//# sourceMappingURL=app.js.map