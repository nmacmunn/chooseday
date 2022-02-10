<script lang="ts">
  import _ from "lodash";
  import type { RatingsContext } from "src/types/context";
  import type { State } from "xstate";
  import { send } from "../machine";
  import { setRatingsWeights } from "../service/db";
  import type { AppEvent } from "../types/events";
  import ListCard from "./list-card.svelte";
  import NextBack from "./next-back.svelte";
  import SortableItem from "./sortable-item.svelte";
  import SortableList from "./sortable-list.svelte";

  export let state: State<RatingsContext, AppEvent, any, any>;

  let top: SortableList;

  function onSorted() {
    const groups = top.sorted().reverse();
    let toUpdate: [string, number][] = [];
    groups.forEach((ratings, i) => {
      const weight = i + 1;
      for (const rating of ratings) {
        if (rating.weight !== weight) {
          toUpdate.push([rating.id, weight]);
        }
      }
    });
    if (toUpdate.length) {
      setRatingsWeights(toUpdate);
    } else {
      state = state;
    }
  }

  $: selectedIndex = state.context.userCriteria.indexOf(
    state.context.criterion
  );
  $: optionTitles = _(state.context.options)
    .keyBy("id")
    .mapValues("title")
    .value();
  $: byWeight = _(state.context.userRatings)
    .filter(_.matchesProperty("criterionId", state.context.criterion.id))
    .groupBy("weight")
    .values()
    .orderBy("0.weight", "desc")
    .value();

  let next: { label: string; event: AppEvent };
  $: nextCriterion = state.context.userCriteria[selectedIndex + 1];
  $: if (nextCriterion) {
    next = {
      label: nextCriterion.title,
      event: { type: "CRITERION", criterion: nextCriterion },
    };
  } else {
    next = {
      label: "Collaborators",
      event: { type: "COLLABORATORS" },
    };
  }

  let back: { label: string; event: AppEvent };
  $: backCriterion = state.context.userCriteria[selectedIndex - 1];
  $: if (backCriterion) {
    back = {
      label: backCriterion.title,
      event: { type: "CRITERION", criterion: backCriterion },
    };
  } else {
    back = {
      label: "Criteria",
      event: { type: "CRITERIA" },
    };
  }
</script>

<ul uk-tab>
  {#each state.context.userCriteria as criterion (criterion.id)}
    <li
      class:uk-active={criterion === state.context.criterion}
      class:disabled={criterion !== state.context.criterion &&
        !state.can({ type: "CRITERION", criterion })}
    >
      <a
        href={criterion.id}
        on:click|preventDefault={() => send({ type: "CRITERION", criterion })}
        >{criterion.title}</a
      >
    </li>
  {/each}
</ul>

<h5 class="uk-text-light">
  <span>Sort by</span>
  <span class="uk-background-muted title">{state.context.criterion.title}</span>
  <span>from best to worst</span>
</h5>

<div
  class="uk-dark uk-background-muted uk-text-center uk-padding-small"
  style="margin-bottom: -10px"
>
  <i>Best option</i>
</div>
<div
  class="uk-padding uk-padding-remove-top uk-padding-remove-bottom"
  style="background-image: linear-gradient(0, transparent, #f8f8f8)"
>
  <SortableList bind:this={top}>
    {#each byWeight as ratings ({})}
      <SortableItem>
        <SortableList on:sorted={onSorted}>
          {#each ratings as rating (rating)}
            <SortableItem data={rating}>
              <ListCard>
                <svelte:fragment slot="left">
                  <span uk-icon="table" class="uk-margin-right" />
                  <span>{optionTitles[rating.optionId]}</span>
                </svelte:fragment>
              </ListCard>
            </SortableItem>
          {/each}
        </SortableList>
      </SortableItem>
    {/each}
  </SortableList>
</div>
<div
  class="uk-text-muted uk-text-center uk-padding-small"
  style="margin-top: -10px"
>
  <i>Worst option</i>
</div>

<NextBack {back} {next} />

<style>
  .title {
    border-bottom: 1px solid;
  }
  .disabled {
    pointer-events: none;
  }
</style>
