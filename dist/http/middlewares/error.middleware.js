import { HttpError } from "../http-error.js";
export const errorMiddleware = (error, _request, response, _next) => {
    if (error instanceof HttpError) {
        response.status(error.statusCode).json({ error: error.message });
        return;
    }
    const prismaError = error;
    if (prismaError.code === "P2002") {
        response.status(409).json({ error: "A record with these data already exists" });
        return;
    }
    if (prismaError.code === "P2023") {
        response.status(400).json({ error: "Invalid identifier" });
        return;
    }
    if (prismaError.code === "P2025") {
        response.status(404).json({ error: "Record not found" });
        return;
    }
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
};
//# sourceMappingURL=error.middleware.js.map