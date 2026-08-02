export function createObjectId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}
//# sourceMappingURL=random.js.map