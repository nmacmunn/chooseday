<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import _ from "lodash";
  import Sortable from "sortablejs";

  let element: HTMLUListElement;

  const dispatch = createEventDispatcher<{ sorted: any }>();

  export function sorted() {
    return _.chain(element.children)
      .map((child) => {
        if (child.classList.contains("sortable-item")) {
          return [Reflect.get(child, "data")];
        }
        const items = child.getElementsByClassName("sortable-item");
        if (items.length) {
          return _.map(items, (item) => Reflect.get(item, "data"));
        }
      })
      .compact()
      .value();
  }

  let sortable: Sortable;
  onMount(() => {
    sortable = Sortable.create(element, {
      animation: 150,
      group: "shared",
      handle: ".sortable-item",
      swapThreshold: 0.65,
      onEnd() {
        dispatch("sorted");
      },
    });
  });
  onDestroy(() => sortable.destroy());
</script>

<ul bind:this={element} class="sortable-list">
  <slot />
</ul>

<style>
  ul.sortable-list {
    list-style: none;
    padding: 0;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
  }

  ul.sortable-list:empty {
    /* hide empty group when dragging out */
    display: none;
  }
</style>
