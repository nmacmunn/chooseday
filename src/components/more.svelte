<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import UIkit from "uikit";

  interface Action {
    icon: string;
    title: string;
    callback: () => void;
  }

  export let actions: [Action, ...Action[]];

  let dropdownEl: HTMLDivElement;
  let dropdown: UIkit.UIkitDropdownElement;

  function onClick(handler: () => void) {
    handler();
    // dropdown.hide has the wrong type signature
    (dropdown as any).hide(false);
  }
  onMount(() => (dropdown = UIkit.dropdown(dropdownEl, { mode: "click" })));
  onDestroy(() => (dropdown as any).$destroy());
</script>

<a href="more" aria-label="more" on:click|preventDefault>
  <span uk-icon="more-vertical" aria-hidden />
</a>
<div bind:this={dropdownEl}>
  <ul class="uk-nav uk-dropdown-nav">
    {#each actions as action}
      <li>
        <a
          href={action.title}
          on:click|preventDefault={() => onClick(action.callback)}
        >
          <span uk-icon={action.icon} />
          <span class="uk-margin-small-left">{action.title}</span>
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
  a {
    color: inherit;
  }
</style>
