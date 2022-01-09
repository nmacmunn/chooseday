<script lang="ts">
  import Body from "./body.svelte";
  import Nav from "./nav.svelte";
  import Navbar from "./navbar.svelte";
</script>

<div class="uk-container">
  <Navbar />
  <div class="uk-grid">
    <div class="uk-width-1-5@m">
      <Nav />
    </div>
    <div class="uk-width-4-5@m">
      <Body />
    </div>
  </div>
</div>
