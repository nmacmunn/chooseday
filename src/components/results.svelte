<script lang="ts">
  import type { ResultsState } from "../types/state";
  import NextBack from "./next-back.svelte";
  import ResultsOverall from "./results-overall.svelte";
  import ResultsUser from "./results-user.svelte";
  import { getName } from "../util/name";
  export let state: ResultsState;
  $: selected = state.context.user;
</script>

<h5 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Best overall</span>
</h5>
<ResultsOverall {state} />

<h5 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Results by collaborator</span>
</h5>
<ul uk-tab>
  {#each state.context.result.getDoneUsers() as user}
    <li class:uk-active={user.id === selected.id}>
      <a href={user.id} on:click|preventDefault={() => (selected = user)}>
        {getName(user, state.context.user, state.context.decision)}
      </a>
    </li>
  {/each}
</ul>
<ResultsUser {state} user={selected} />

<NextBack back={{ label: "Collaborators", event: { type: "COLLABORATORS" } }} />

<style>
  h5 {
    margin-bottom: 40px;
  }
</style>
