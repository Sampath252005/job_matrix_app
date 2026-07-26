const configuredOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
export const allowedFrontendOrigins = [
    ...new Set([
        "http://localhost:3000",
        "http://10.181.52.183:3000",
        "http://192.168.1.69:3000",
        ...configuredOrigins,
    ]),
];
//# sourceMappingURL=cors.js.map