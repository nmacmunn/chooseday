<script lang="ts">
  import type { ErrorState } from "src/types/state";

  import { send } from "../machine";
  import Heading from "./heading.svelte";
  export let state: ErrorState;
</script>

<div class="uk-alert uk-text-center">
  <Heading>Oh no!</Heading>
  <p>{state.context.error}</p>
  <button class="uk-button uk-button-primary" on:click={() => send("HOME")}>
    Home
  </button>
</div>
