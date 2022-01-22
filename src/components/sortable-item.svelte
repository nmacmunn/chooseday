<script lang="ts">
  import { onMount } from "svelte";
  export let data: any = undefined;
  let element: HTMLLIElement;
  onMount(() => Reflect.set(element, "data", data));
</script>

<li
  class:sortable-container={data === undefined}
  class:sortable-item={data !== undefined}
  bind:this={element}
>
  <slot />
</li>
