<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import _ from "lodash";
  import type { SortEventDetail } from "src/types/components";

  const dispatch = createEventDispatcher<{
    sorted: SortEventDetail<any>;
  }>();

  let listElement: HTMLUListElement;

  function onMoved() {
    const children = _.chain(listElement.children)
      .map("data")
      .reverse()
      .value();
    const detail: SortEventDetail<any> = {};
    let group = 0;
    // force skipping the first divider
    let divider = children[0].type === "divider";
    for (const child of children) {
      // skip consecutive dividers
      if (divider && child.type === "divider") {
        continue;
      }
      divider = child.type === "divider";
      if (divider) {
        group++;
      } else {
        detail[group] = detail[group] || [];
        detail[group].push(child.value);
      }
    }
    dispatch("sorted", detail);
  }

  onMount(() => {
    const event = "moved";
    listElement.addEventListener(event, onMoved);
    return listElement.removeEventListener.bind(listElement, event, onMoved);
  });
</script>

<ul
  class="uk-grid-small uk-child-width-1-1"
  uk-sortable="group: group; handle: .uk-sortable-handle"
  uk-grid
  bind:this={listElement}
>
  <slot />
</ul>
