export function asyncHandler(handler) {
    return (request, response, next) => {
        void handler(request, response).catch(next);
    };
}
//# sourceMappingURL=async-handler.js.map