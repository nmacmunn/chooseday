<script lang="ts">
  import { onMount } from "svelte";

  export let label = "";
  export let placeholder: string;
  export let onSubmit: (value: string) => void;
  let value: string;
  function callback() {
    onSubmit(value);
    value = "";
  }
  let inputElement: HTMLInputElement;
  onMount(() => {
    inputElement.focus();
  });
</script>

<div class="uk-margin">
  <div class="uk-padding uk-padding-remove-top uk-background-muted">
    <div class="uk-text-light uk-padding-small uk-padding-remove-left">
      {label}
    </div>
    <form on:submit|preventDefault={callback}>
      <div class="uk-inline uk-width-1-1">
        <a
          class="uk-form-icon uk-form-icon-flip"
          href="create"
          aria-label="create"
          on:click|preventDefault={callback}
        >
          <span aria-hidden uk-icon="plus" />
        </a>
        <input
          class="uk-input"
          name="create"
          type="text"
          {placeholder}
          bind:value
          bind:this={inputElement}
        />
      </div>
    </form>
  </div>
</div>
