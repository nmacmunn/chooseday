<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import UIkit from "uikit";

  export let onEdit: () => void;
  export let onDelete: () => void;

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
    <li>
      <a
        href="edit"
        title="edit"
        on:click|preventDefault={() => onClick(onEdit)}
      >
        <span uk-icon="pencil" />
        <span class="uk-margin-small-left">Edit</span>
      </a>
    </li>
    <li>
      <a
        href="delete"
        title="delete"
        on:click|preventDefault={() => onClick(onDelete)}
      >
        <span uk-icon="trash" />
        <span class="uk-margin-small-left">Delete</span>
      </a>
    </li>
  </ul>
</div>

<style>
  a {
    color: inherit;
  }
</style>
