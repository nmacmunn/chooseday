<script lang="ts">
  import { onMount } from "svelte";
  export let value: any = undefined;
  let element: HTMLLIElement;
  onMount(() => {
    const data = {
      type: "divider",
      value,
    };
    Reflect.set(element, "data", data);
  });
</script>

<li class="uk-sortable-nodrag" bind:this={element}>
  {#if $$slots.default}
    <div class="uk-heading-line uk-text-center uk-text-muted">
      <span>
        <slot />
      </span>
    </div>
  {:else}
    <hr />
  {/if}
</li>

<style>
  li {
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
