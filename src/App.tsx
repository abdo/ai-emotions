import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { TheatrePage } from './pages/TheatrePage/TheatrePage';
import { groqApiKey, openAiTTSApiKey } from './keys.ignore';
import { MissingKeys } from './components/MissingKeys/MissingKeys';
import { PostHogPageView } from './components/PostHogPageView/PostHogPageView';
import "./App.css";

function App() {
  // Check for missing keys
  const missingKeys: string[] = [];
  if (!groqApiKey || groqApiKey.includes("...")) missingKeys.push("groqApiKey");
  if (!openAiTTSApiKey || openAiTTSApiKey.includes("...")) missingKeys.push("openAiTTSApiKey");
  if (!groqApiKey || groqApiKey.includes("...")) missingKeys.push("groqApiKey");
  if (!openAiTTSApiKey || openAiTTSApiKey.includes("...")) missingKeys.push("openAiTTSApiKey");
  // PostHog is optional for local dev/users

  if (missingKeys.length > 0) {
    return <MissingKeys missingKeys={missingKeys} />;
  }

  return (
    <Router>
      <PostHogPageView />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/theatre" element={<TheatrePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
