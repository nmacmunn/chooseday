<script lang="ts">
  import { onMount } from "svelte";
  const noop = () => undefined;
  export let onClick: () => unknown = noop;
  export let value: any = undefined;
  export let sortable = false;
  let element: HTMLLIElement;
  onMount(() => {
    const data = {
      type: "item",
      value,
    };
    Reflect.set(element, "data", data);
  });
</script>

<li bind:this={element}>
  <div
    class="uk-card uk-card-default uk-card-small uk-card-body"
    class:uk-sortable-handle={sortable}
    class:uk-card-hover={onClick !== noop}
  >
    <div class="uk-grid uk-flex-middle">
      <div
        class="uk-width-expand"
        class:pointer={onClick !== noop}
        on:click={onClick}
      >
        <slot name="left" />
      </div>
      <div class="uk-width-auto">
        <slot name="right" />
      </div>
    </div>
  </div>
</li>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
