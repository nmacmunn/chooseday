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
<div
  class="uk-margin-large-top uk-padding-small uk-background-muted uk-text-small uk-text-muted uk-text-center"
>
  made by <a href="https://neil.macmunn.com" target="_blank">Neil MacMunn</a>
</div>

<style>
  .uk-container {
    min-height: calc(100vh - 91px);
  }
  @media (min-width: 1200px) {
    .uk-container {
      min-height: calc(100vh - 121px);
    }
  }
</style>
