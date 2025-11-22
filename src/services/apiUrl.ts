// Automatically switch between local and production based on environment
const apiUrl = import.meta.env.DEV
  ? "http://localhost:5000/ai-show-afb45/us-central1/getShow"
  : "https://getshow-ejinsneowq-uc.a.run.app";

export default apiUrl;