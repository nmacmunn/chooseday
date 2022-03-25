<script lang="ts">
  import { state } from "../machine";
  import { stateValue } from "../util/state-value";
  import Collaborators from "./collaborators.svelte";
  import Criteria from "./criteria.svelte";
  import Decisions from "./decisions.svelte";
  import Error from "./error.svelte";
  import Loading from "./loading.svelte";
  import Options from "./options.svelte";
  import Ratings from "./ratings.svelte";
  import Results from "./results.svelte";

  const {
    collaborators,
    criteria,
    decisionLoaded,
    decisionLoading,
    decisionsLoaded,
    decisionsLoading,
    options,
    preAuth,
    ratings,
    results,
    route,
    signingIn,
  } = stateValue;
</script>

{#if $state.matches("error")}
  <Error state={$state} />
{:else if $state.matches(preAuth) || $state.matches(signingIn) || $state.matches(route) || $state.matches(decisionLoading) || $state.matches(decisionsLoading)}
  <Loading text="Loading, please wait..." />
{:else if $state.matches(decisionsLoaded)}
  <Decisions state={$state} />
{:else if $state.matches(decisionLoaded)}
  <i class="uk-text-large uk-text-light uk-margin-small">
    {$state.context.decision.title}
  </i>
  {#if $state.matches(options)}
    <Options state={$state} />
  {:else if $state.matches(criteria)}
    <Criteria state={$state} />
  {:else if $state.matches(ratings)}
    <Ratings state={$state} />
  {:else if $state.matches(collaborators)}
    <Collaborators state={$state} />
  {:else if $state.matches(results)}
    <Results state={$state} />
  {/if}
{/if}

<style>
  i {
    background-size: 1px 8px;
    background-image: linear-gradient(0deg, #ffd166, #ffd166);
    background-repeat: repeat-x;
    background-position-y: 20px;
  }
</style>
