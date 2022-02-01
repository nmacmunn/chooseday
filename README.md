# Indecisionator

Indecisionator is an application that helps you make better decisions with greater confidence.

## Live Demo

Try the current version [here](https://indecisionator.web.app). Please be aware that this is for demonstration purposes only and your data may be deleted at any time.

## Getting Started

- Install [Node.js](https://nodejs.org/en/download/)
- [Create a Firebase project](https://firebase.google.com/docs/web/setup#create-project)
- Run the following in a terminal
  ```sh
  git clone git@github.com:nmacmunn/indecisionator.git
  cd indecisionator
  npm install
  npm run dev
  ```
- Create `.env.local` in the root directory with the following environment variables (sub the values for your Firebase project)
  ```
  VITE_FIREBASE_API_KEY=<firebase-api-key>
  VITE_FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
  VITE_FIREBASE_PROJECT_ID=<firebase-project-id>
  VITE_FIREBASE_MESSAGE_SENDER_ID=<firebase-message-sender-id>
  VITE_FIREBASE_APP_ID=<firebase-app-id>
  ```
- Open http://localhost:3000 in your browser

## Technology

Indecisionator is built with:

- [chart.js](https://www.chartjs.org/)
- [firebase](https://firebase.google.com/)
- [svelte](https://svelte.dev/)
- [uikit](https://getuikit.com/)
- [xstate](https://xstate.js.org/)
