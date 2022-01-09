import Chart from "chart.js/auto";
import UIkit from "uikit";
import "uikit/dist/css/uikit.css";
import Icons from "uikit/dist/js/uikit-icons";
import App from "./components/app.svelte";

(UIkit.use as any)(Icons);

Chart.defaults.font.family = getComputedStyle(
  document.documentElement
).fontFamily;

const elementId = "app";
const target = document.getElementById(elementId);
if (!target) {
  throw new Error(`Cannot mount application: #${elementId} not found`);
}

export default new App({ target });
