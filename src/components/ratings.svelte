<script lang="ts">
  import _ from "lodash";
  import type { State } from "xstate";
  import { setRatingsWeights } from "../db";
  import { send } from "../machine";
  import type { Rating } from "../types/data";
  import type { AppEvent } from "../types/events";
  import type { RatingsState } from "../types/states";
  import ListCard from "./list-card.svelte";
  import NextBack from "./next-back.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";
  import SortableItem from "./sortable-item.svelte";
  import SortableList from "./sortable-list.svelte";

  export let state: State<RatingsState["context"], AppEvent>;

  let top: SortableList;

  const criteria = state.context.criteria.filter(
    ({ user }) => user.id === state.context.user.id
  );

  $: selectedIndex = Math.max(criteria.indexOf(state.context.criterion), 0);
  $: selected = criteria[selectedIndex];

  const optionTitles = _.chain(state.context.options)
    .keyBy("id")
    .mapValues("title")
    .value();

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

  interface Sorted {
    all: Rating[];
    byWeight: Record<number, Rating[]>;
    weights: number[];
  }

  let sorted: Sorted | undefined;
  $: if (state.context.ratings) {
    const all = _.chain(state.context.ratings)
      .filter(_.matchesProperty("criterionId", selected.id))
      .orderBy("weight", "desc")
      .value();
    const byWeight = _.groupBy(all, "weight");
    const weights = _.keys(byWeight).map(Number).sort().reverse();
    sorted = {
      all,
      byWeight,
      weights,
    };
  }

  let next: { label: string; event: AppEvent };
  $: if (selectedIndex + 1 < criteria.length) {
    const criterion = criteria[selectedIndex + 1];
    next = {
      label: criterion.title,
      event: { type: "CRITERION", criterion },
    };
  } else {
    next = {
      label: "Collaborators",
      event: { type: "COLLABORATORS" },
    };
  }

  let back: { label: string; event: AppEvent };
  $: if (selectedIndex > 0) {
    const criterion = criteria[selectedIndex - 1];
    back = {
      label: criterion.title,
      event: { type: "CRITERION", criterion },
    };
  } else {
    back = {
      label: "Criteria",
      event: { type: "CRITERIA" },
    };
  }
</script>

<ul uk-tab>
  {#each criteria as criterion (criterion.id)}
    <li
      class:uk-active={selected === criterion}
      class:disabled={selected !== criterion &&
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
  <span>Sort options by</span>
  <span class="uk-background-muted title">{selected.title}</span>
  <span>from best to worst</span>
</h5>

{#if !sorted}
  <PlaceholderCard>
    <span uk-spinner class="uk-margin-right" />
    <span>Loading ratings</span>
  </PlaceholderCard>
{:else}
  <div class="uk-text-muted uk-text-center uk-margin"><b>Best</b> option</div>
  <SortableList bind:this={top}>
    {#each sorted.weights as weight, i ({})}
      <SortableItem>
        <SortableList on:sorted={onSorted}>
          {#each sorted.byWeight[weight] as rating (rating)}
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
  <div class="uk-text-muted uk-text-center uk-margin"><b>Worst</b> option</div>
{/if}

<NextBack {back} {next} />

<style>
  .title {
    border-bottom: 1px solid;
  }
  .disabled {
    pointer-events: none;
  }
</style>
