<script lang="ts">
  import { state } from "../machine";
  import { stateValue } from "../util/state-value";
  import Body from "./body.svelte";
  import Nav from "./nav.svelte";
  import Navbar from "./navbar.svelte";
  import SignIn from "./sign-in.svelte";
  const { signedOut } = stateValue;
</script>

<div class="uk-container">
  <Navbar />
  <div class="uk-grid">
    {#if $state.matches(signedOut)}
      <SignIn />
    {:else}
      <div class="uk-width-1-5@m">
        <Nav />
      </div>
      <div class="uk-width-4-5@m">
        <Body />
      </div>
    {/if}
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
