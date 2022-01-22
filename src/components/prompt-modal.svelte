<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import UIkit from "uikit";

  export let onSubmit: (value: string) => void;
  export let title: string;
  export let value = "";

  let el: HTMLDivElement;
  let modal: UIkit.UIkitModalElement;

  onMount(() => (modal = UIkit.modal(el)));
  onDestroy(() => (modal as any).$destroy());

  function submit() {
    onSubmit(value);
    value = "";
    modal.hide();
  }

  export const show = () => modal.show();
</script>

<div class="uk-modal" bind:this={el}>
  <div class="uk-modal-dialog">
    <form class="uk-form-stacked" on:submit|preventDefault={submit}>
      <div class="uk-modal-body">
        <label>
          {title}
          <input class="uk-input" bind:value />
        </label>
      </div>
      <div class="uk-modal-footer uk-text-right">
        <button
          class="uk-button uk-button-default uk-modal-close"
          type="button"
        >
          Cancel
        </button>
        <button class="uk-button uk-button-primary"> Ok </button>
      </div>
    </form>
  </div>
</div>
