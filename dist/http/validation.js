import { HttpError } from "./http-error.js";
export function object(value, field = "body") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new HttpError(400, `${field} must be an object`);
    }
    return value;
}
export function stringField(source, field) {
    const value = source[field];
    if (typeof value !== "string" || !value.trim()) {
        throw new HttpError(400, `${field} is required`);
    }
    return value.trim();
}
export function integerField(source, field) {
    const value = source[field];
    if (!Number.isInteger(value) || value < 0) {
        throw new HttpError(400, `${field} must be a non-negative integer`);
    }
    return value;
}
export function dateField(source, field) {
    const value = stringField(source, field);
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new HttpError(400, `${field} must be a valid ISO date`);
    }
    return date;
}
export function routeParam(value, field) {
    if (typeof value !== "string" || !value) {
        throw new HttpError(400, `${field} route parameter is required`);
    }
    return value;
}
//# sourceMappingURL=validation.js.map