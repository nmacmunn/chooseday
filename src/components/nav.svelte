<script lang="ts">
  import { send, state } from "../machine";

  const items = [
    {
      title: "Decisions",
      stateValue: { auth: { signedIn: { decisions: "loaded" } } },
      event: { type: "DECISIONS" },
    },
    {
      title: "Options",
      stateValue: { auth: { signedIn: { decision: { loaded: "options" } } } },
      event: { type: "OPTIONS" },
    },
    {
      title: "Criteria",
      stateValue: { auth: { signedIn: { decision: { loaded: "criteria" } } } },
      event: { type: "CRITERIA" },
    },
    {
      title: "Ratings",
      stateValue: { auth: { signedIn: { decision: { loaded: "ratings" } } } },
      event: { type: "RATINGS" },
    },
    {
      title: "Collaborators",
      stateValue: {
        auth: { signedIn: { decision: { loaded: "collaborators" } } },
      },
      event: { type: "COLLABORATORS" },
    },
    {
      title: "Results",
      stateValue: { auth: { signedIn: { decision: { loaded: "results" } } } },
      event: { type: "RESULTS" },
    },
  ] as const;
</script>

<ul
  class="uk-tab uk-tab-left"
  uk-toggle="cls: uk-tab-left; mode: media; media: @m"
>
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
