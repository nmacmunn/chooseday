<script lang="ts">
  import { state } from "../machine";
  import { delay } from "../util/delay";
  import Collaborators from "./collaborators.svelte";
  import Criteria from "./criteria.svelte";
  import Decisions from "./decisions.svelte";
  import Heading from "./heading.svelte";
  import Options from "./options.svelte";
  import Ratings from "./ratings.svelte";
  import Results from "./results.svelte";
  import SignIn from "./sign-in.svelte";

  const ready = delay();
</script>

{#if !$ready || $state.matches({ root: "loading" })}
  <div class="uk-padding uk-text-center">
    <div uk-spinner="ratio: 3" />
  </div>
{:else if $state.matches({ root: "signedOut" })}
  <SignIn />
{:else if $state.matches({ root: { signedIn: "decisions" } })}
  <Heading>
    <span slot="title">Decisions</span>
  </Heading>
  <Decisions state={$state} />
{:else if $state.matches({ root: { signedIn: "decision" } })}
  {#if $state.matches({ root: { signedIn: { decision: "options" } } })}
    <Heading>
      <span slot="title">{$state.context.decision.title} options</span>
    </Heading>
    <Options state={$state} />
  {:else if $state.matches({ root: { signedIn: { decision: "criteria" } } })}
    <Heading>
      <span slot="title">{$state.context.decision.title} criteria</span>
    </Heading>
    <Criteria state={$state} />
  {:else if $state.matches({ root: { signedIn: { decision: "ratings" } } })}
    <Heading>
      <span slot="title">{$state.context.decision.title} ratings</span>
    </Heading>
    <Ratings state={$state} />
  {:else if $state.matches( { root: { signedIn: { decision: "collaborators" } } } )}
    <Heading>
      <span slot="title">{$state.context.decision.title} collaborators</span>
    </Heading>
    <Collaborators state={$state} />
  {:else if $state.matches({ root: { signedIn: { decision: "results" } } })}
    <Heading>
      <span slot="title">{$state.context.decision.title} results</span>
    </Heading>
    <Results state={$state} />
  {/if}
{/if}
