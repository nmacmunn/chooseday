<script lang="ts">
  import UIkit from "uikit";

  export let onEdit: () => void;
  export let onDelete: () => void;

  let dropdown: HTMLDivElement;
  function onClick(handler: () => void) {
    handler();
    // dropdown.hide has the wrong type signature
    (UIkit.dropdown(dropdown) as any).hide(false);
  }
</script>

<!-- svelte-ignore a11y-missing-content -->
<a href="more" uk-icon="more-vertical" on:click|preventDefault />
<div uk-dropdown="mode: click" bind:this={dropdown}>
  <ul class="uk-nav uk-dropdown-nav">
    <li>
      <a href="edit" on:click|preventDefault={() => onClick(onEdit)}>
        <span uk-icon="pencil" />
        <span class="uk-margin-small-left">Edit</span>
      </a>
    </li>
    <li>
      <a href="delete" on:click|preventDefault={() => onClick(onDelete)}>
        <span uk-icon="trash" />
        <span class="uk-margin-small-left">Delete</span>
      </a>
    </li>
  </ul>
</div>
