<script lang="ts">
  import { state } from "../machine";
  import Collaborators from "./collaborators.svelte";
  import Creating from "./creating.svelte";
  import Criteria from "./criteria.svelte";
  import Decisions from "./decisions.svelte";
  import Heading from "./heading.svelte";
  import Loading from "./loading.svelte";
  import Options from "./options.svelte";
  import Ratings from "./ratings.svelte";
  import Results from "./results.svelte";
  import SignIn from "./sign-in.svelte";
</script>

{#if $state.matches("preAuth") || $state.matches( { auth: "signingIn" } ) || $state.matches( { auth: { signedIn: { decision: "loading" } } } ) || $state.matches( { auth: { signedIn: { decisions: "loading" } } } )}
  <Loading text="Loading, please wait..." />
{:else if $state.matches({ auth: "signedOut" })}
  <SignIn />
{:else if $state.matches({ auth: { signedIn: { decisions: "loaded" } } })}
  <Heading>Decisions</Heading>
  <Decisions state={$state} />
{:else if $state.matches({ auth: { signedIn: { decisions: "creating" } } })}
  <Creating state={$state} />
{:else if $state.matches( { auth: { signedIn: { decision: { loaded: "options" } } } } )}
  <Heading>
    {$state.context.decision.title} <i>options</i>
  </Heading>
  <Options state={$state} />
{:else if $state.matches( { auth: { signedIn: { decision: { loaded: "criteria" } } } } )}
  <Heading>
    {$state.context.decision.title} <i>criteria</i>
  </Heading>
  <Criteria state={$state} />
{:else if $state.matches( { auth: { signedIn: { decision: { loaded: "ratings" } } } } )}
  <Heading>
    {$state.context.decision.title} <i>ratings</i>
  </Heading>
  <Ratings state={$state} />
{:else if $state.matches( { auth: { signedIn: { decision: { loaded: "collaborators" } } } } )}
  <Heading>
    {$state.context.decision.title} <i>collaborators</i>
  </Heading>
  <Collaborators state={$state} />
{:else if $state.matches( { auth: { signedIn: { decision: { loaded: "results" } } } } )}
  <Heading>
    {$state.context.decision.title} <i>results</i>
  </Heading>
  <Results state={$state} />
{/if}
