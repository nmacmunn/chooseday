<script lang="ts">
  import _ from "lodash";
  import UIkit from "uikit";
  import { addCriterion, removeCriterion, updateCriterion } from "../db";
  import type { SortEventDetail } from "../types/components";
  import type { Criterion } from "../types/data";
  import type { CriteriaState } from "../types/states";
  import Create from "./create.svelte";
  import ListCard from "./list-card.svelte";
  import ListDivider from "./list-divider.svelte";
  import More from "./more.svelte";
  import NextBack from "./next-back.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";
  import Sortable from "./sortable.svelte";

  export let state: CriteriaState;

  async function editTitle(criteria: Criterion) {
    const title = await UIkit.modal.prompt("Title", criteria.title);
    if (typeof title == "string") {
      criteria.title = title;
      updateCriterion(criteria);
    }
  }

  function onSorted(event: CustomEvent<SortEventDetail<Criterion>>) {
    const groups = Object.keys(event.detail).map(Number);
    let updated = false;
    for (const group of groups) {
      const weight = group + 1;
      for (const criterion of event.detail[group]) {
        if (criterion.weight !== weight) {
          criterion.weight = weight;
          updateCriterion(criterion);
          updated = true;
        }
      }
    }
    if (!updated) {
      state = state;
    }
  }

  interface Sorted {
    all: Criterion[];
    byWeight: Record<number, Criterion[]>;
    weights: number[];
  }

  let sorted: Sorted | undefined;
  $: if (state.context.criteria) {
    const all = state.context.criteria;
    const byWeight = _.groupBy(all, "weight");
    const weights = _.keys(byWeight).map(Number).sort().reverse();
    sorted = {
      all,
      byWeight,
      weights,
    };
  }
</script>

<Create
  label="Add criteria"
  placeholder="Cost, nutrition, delivery time, etc."
  onSubmit={(title) =>
    addCriterion(state.context.decision.id, title, state.context.user)}
/>

<h5 class="uk-text-light">
  <span>Sort criteria from most to least important</span>
</h5>

{#if !sorted}
  <PlaceholderCard>
    <span uk-spinner class="uk-margin-right" />
    <span>Loading criteria</span>
  </PlaceholderCard>
{:else}
  {#if sorted.all.length < 2}
    <PlaceholderCard>
      <span uk-icon="info" class="uk-margin-right" />
      Create at least {sorted.all.length
        ? "one more criterion"
        : "two criteria"}
    </PlaceholderCard>
  {/if}

  <Sortable on:sorted={onSorted}>
    {#each sorted.weights as weight, i ({})}
      {#if i === 0}
        <ListDivider><b>Most</b> important</ListDivider>
      {:else}
        <ListDivider />
      {/if}
      {#each sorted.byWeight[weight] as criterion (criterion)}
        <ListCard value={criterion}>
          <svelte:fragment slot="left">
            <span uk-icon="table" class="uk-margin-right uk-sortable-handle" />
            <span>{criterion.title}</span>
          </svelte:fragment>
          <svelte:fragment slot="right">
            <More
              onDelete={() => removeCriterion(criterion)}
              onEdit={() => editTitle(criterion)}
            />
          </svelte:fragment>
        </ListCard>
      {/each}
    {/each}
    {#if sorted.weights.length}
      <ListDivider><b>Least</b> important</ListDivider>
    {/if}
  </Sortable>
{/if}

<NextBack
  back={{ label: "Options", event: { type: "OPTIONS" } }}
  next={{ label: "Ratings", event: { type: "RATINGS" } }}
/>
