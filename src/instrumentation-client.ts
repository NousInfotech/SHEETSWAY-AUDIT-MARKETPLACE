// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.    
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7caf2be0909fa98ca44fbf3b052660de@o4509676650364928.ingest.de.sentry.io/4509676662685776",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;