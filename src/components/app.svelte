<script lang="ts">
  import Chart from "chart.js/auto";
  import "../../node_modules/uikit/dist/css/uikit.css";
  import UIkit from "uikit";
  import Icons from "uikit/dist/js/uikit-icons";
  import Body from "./body.svelte";
  import Nav from "./nav.svelte";
  import Navbar from "./navbar.svelte";

  (UIkit.use as any)(Icons);

  Object.assign(Chart.defaults.font, {
    family: getComputedStyle(document.documentElement).fontFamily,
  });
</script>

<div class="uk-container">
  <Navbar />
  <div class="uk-grid">
    <div class="uk-width-1-2@s uk-width-1-5@m">
      <Nav />
    </div>
    <div class="uk-width-1-2@s uk-width-4-5@m">
      <Body />
    </div>
  </div>
</div>
