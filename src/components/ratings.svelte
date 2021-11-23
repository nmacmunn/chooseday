<script lang="ts">
  import _ from "lodash";
  import type { AppEvent } from "../types/events";
  import { setRatingsWeights } from "../db";
  import { send } from "../machine";
  import type { SortEventDetail } from "../types/components";
  import type { Rating } from "../types/data";
  import type { RatingsState } from "../types/states";
  import ListCard from "./list-card.svelte";
  import ListDivider from "./list-divider.svelte";
  import NextBack from "./next-back.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";
  import Sortable from "./sortable.svelte";

  export let state: RatingsState;

  const criteria = state.context.criteria.filter(
    ({ user }) => user.id === state.context.user.id
  );
  let selectedIndex = 0;
  $: if (state.context.criterion) {
    const index = criteria.indexOf(state.context.criterion);
    if (index > -1) {
      selectedIndex = index;
    }
  }
  $: selected = criteria[selectedIndex];

  const optionTitles = _.chain(state.context.options)
    .keyBy("id")
    .mapValues("title")
    .value();

  function onSorted(event: CustomEvent<SortEventDetail<Rating>>) {
    const groups = Object.keys(event.detail).map(Number);
    let toUpdate: [string, number][] = [];
    for (const group of groups) {
      const weight = group + 1;
      for (const rating of event.detail[group]) {
        if (rating.weight !== weight) {
          toUpdate.push([rating.id, weight]);
        }
      }
    }
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
    <li class={selected === criterion ? "uk-active" : ""}>
      <a
        href={criterion.id}
        on:click|preventDefault={() => send({ type: "CRITERION", criterion })}
        >{criterion.title}</a
      >
    </li>
  {/each}
</ul>

<h5 class="uk-text-light">
  <span>Sort options by {selected.title.toLowerCase()} from best to worst</span>
</h5>

{#if !sorted}
  <PlaceholderCard>
    <span uk-spinner class="uk-margin-right" />
    <span>Loading ratings</span>
  </PlaceholderCard>
{:else}
  <Sortable on:sorted={onSorted}>
    {#each sorted.weights as weight, i ({})}
      {#if i === 0}
        <ListDivider><b>Best</b> option</ListDivider>
      {:else}
        <ListDivider />
      {/if}
      {#each sorted.byWeight[weight] as rating (rating)}
        <ListCard value={rating}>
          <svelte:fragment slot="left">
            <span uk-icon="table" class="uk-margin-right uk-sortable-handle" />
            <span>{optionTitles[rating.optionId]}</span>
          </svelte:fragment>
        </ListCard>
      {/each}
    {/each}
    {#if sorted.weights.length}
      <ListDivider><b>Worst</b> option</ListDivider>
    {/if}
  </Sortable>
{/if}

<NextBack {back} {next} />
