<script lang="ts">
  import { send, state } from "../machine";

  const items = [
    {
      title: "Decisions",
      stateValue: { root: { signedIn: "decisions" } },
      event: { type: "DECISIONS" },
    },
    {
      title: "Options",
      stateValue: { root: { signedIn: { decision: "options" } } },
      event: { type: "OPTIONS" },
    },
    {
      title: "Criteria",
      stateValue: { root: { signedIn: { decision: "criteria" } } },
      event: { type: "CRITERIA" },
    },
    {
      title: "Ratings",
      stateValue: { root: { signedIn: { decision: "ratings" } } },
      event: { type: "RATINGS" },
    },
    {
      title: "Collaborators",
      stateValue: { root: { signedIn: { decision: "collaborators" } } },
      event: { type: "COLLABORATORS" },
    },
    {
      title: "Results",
      stateValue: { root: { signedIn: { decision: "results" } } },
      event: { type: "RESULTS" },
    },
  ] as const;
</script>

<ul class="uk-tab uk-tab-left uk-visible@m">
  {#each items as { event, stateValue, title } (title)}
    <li
      class:uk-active={$state.matches(stateValue)}
      class:uk-disabled={!$state.can(event)}
    >
      <a href="#{title}" on:click|preventDefault={() => send(event)}>{title}</a>
    </li>
  {/each}
</ul>

<ul class="uk-tab uk-hidden@m">
  {#each items as { event, stateValue, title } (title)}
    <li
      class:uk-active={$state.matches(stateValue)}
      class:uk-disabled={!$state.can(event)}
    >
      <a href="#{title}" on:click|preventDefault={() => send(event)}>{title}</a>
    </li>
  {/each}
</ul>

<style>
  .uk-tab > .uk-disabled.uk-active > a {
    color: #333;
  }
  .uk-tab > .uk-disabled:not(.uk-active) > a {
    color: #eee;
  }
</style>
