<script lang="ts">
  import type { ResultsState } from "../types/state";
  import { processResults } from "../util/results";
  import NextBack from "./next-back.svelte";
  import ResultsOverall from "./results-overall.svelte";
  import ResultsUser from "./results-user.svelte";

  export let state: ResultsState;

  $: processed = processResults(state.context.criteria, state.context.ratings);
</script>

<h5 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Best overall</span>
</h5>
<ResultsOverall {processed} {state} />

<h5 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Results by collaborator</span>
</h5>
<ul uk-tab>
  {#each ["yours"] as user}
    <li class:uk-active={true}>
      <a href={user} on:click|preventDefault>{user}</a>
    </li>
  {/each}
</ul>
<ResultsUser {processed} {state} />

<NextBack back={{ label: "Collaborators", event: { type: "COLLABORATORS" } }} />

<style>
  h5 {
    margin-bottom: 40px;
  }
</style>
