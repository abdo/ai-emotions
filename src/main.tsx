import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App.tsx'
import { posthogApiKey } from './keys.ignore'

const options = {
  api_host: "https://eu.i.posthog.com",
  defaults: {
    opt_in_site_apps: true,
  } as any,
  debug: true, // Enable debug mode to see logs in console
}

const isPostHogEnabled = posthogApiKey && !posthogApiKey.includes("...");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPostHogEnabled ? (
      <PostHogProvider apiKey={posthogApiKey} options={options}>
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
