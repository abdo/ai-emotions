// Automatically switch CORS origins based on environment
// When running locally (Firebase emulator -firebase serve-), allow localhost
// In production, only allow production domain

const devOrigins = ["http://localhost:5173", "https://ai-show.com"];
const prodOrigins = ["https://ai-show.com"];

export const allowedOrigins = process.env.FUNCTIONS_EMULATOR ? devOrigins : prodOrigins;