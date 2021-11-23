import App from "./components/app.svelte";

const elementId = "app";
const target = document.getElementById(elementId);
if (!target) {
  throw new Error(`Cannot mount application: #${elementId} not found`);
}

const app = new App({ target });

export default app;
