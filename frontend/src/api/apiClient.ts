const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";

export const API_URL = `${SERVER_URL}${API_PREFIX}`;
export const API_KEY = import.meta.env.VITE_API_KEY;
