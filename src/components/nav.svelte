<script lang="ts">
  import { send, state } from "../machine";
  import { stateValue } from "../util/state-value";

  const {
    decisionsLoaded,
    options,
    criteria,
    ratings,
    collaborators,
    results,
  } = stateValue;

  const items = [
    {
      title: "Decisions",
      stateValue: decisionsLoaded,
      event: { type: "DECISIONS" },
    },
    {
      title: "Options",
      stateValue: options,
      event: { type: "OPTIONS" },
    },
    {
      title: "Criteria",
      stateValue: criteria,
      event: { type: "CRITERIA" },
    },
    {
      title: "Ratings",
      stateValue: ratings,
      event: { type: "RATINGS" },
    },
    {
      title: "Collaborators",
      stateValue: collaborators,
      event: { type: "COLLABORATORS" },
    },
    {
      title: "Results",
      stateValue: results,
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
