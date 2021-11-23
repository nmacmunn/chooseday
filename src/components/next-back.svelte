<script lang="ts">
  import type { AppEvent } from "../types/events";
  import { send, state } from "../machine";

  export let back: { label: string; event: AppEvent } | undefined = undefined;
  export let next: { label: string; event: AppEvent } | undefined = undefined;
</script>

<div class="uk-flex uk-flex-middle uk-flex-between uk-height-small">
  <div>
    {#if back}
      <button
        class="uk-button"
        class:uk-disabled={!$state.can(back.event)}
        class:uk-button-default={$state.can(back.event)}
        on:click={send.bind(undefined, back.event, undefined)}
      >
        <span uk-icon="icon: arrow-left" />
        {back.label}
      </button>
    {/if}
  </div>
  <div>
    {#if next}
      <button
        class="uk-button"
        class:uk-disabled={!$state.can(next.event)}
        class:uk-button-primary={$state.can(next.event)}
        on:click={send.bind(undefined, next.event, undefined)}
      >
        {next.label}
        <span uk-icon="icon: arrow-right" />
      </button>
    {/if}
  </div>
</div>
