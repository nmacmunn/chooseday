<script lang="ts">
  import _ from "lodash";
  import UIkit from "uikit";
  import {
    addCriterion,
    removeCriterion,
    updateCriterion,
  } from "../service/db";
  import type { Criterion } from "../types/data";
  import type { CriteriaState } from "../types/state";
  import Create from "./create.svelte";
  import ListCard from "./list-card.svelte";
  import More from "./more.svelte";
  import NextBack from "./next-back.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";
  import SortableItem from "./sortable-item.svelte";
  import SortableList from "./sortable-list.svelte";

  export let state: CriteriaState;

  async function editTitle(criteria: Criterion) {
    const title = await UIkit.modal.prompt("Title", criteria.title);
    if (typeof title == "string") {
      criteria.title = title;
      updateCriterion(criteria);
    }
  }

  function onSorted() {
    let updated = false;
    const groups = top.sorted().reverse();
    groups.forEach((criteria, i) => {
      const weight = i + 1;
      for (const criterion of criteria) {
        if (criterion.weight !== weight) {
          criterion.weight = weight;
          updateCriterion(criterion);
          updated = true;
        }
      }
    });
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
  let top: SortableList;
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
  <div class="uk-text-muted uk-text-center uk-margin">
    <b>Most</b> important
  </div>
  <SortableList bind:this={top}>
    {#each sorted.weights as weight ({})}
      <SortableItem>
        <SortableList on:sorted={onSorted}>
          {#each sorted.byWeight[weight] as criterion (criterion)}
            <SortableItem data={criterion}>
              <ListCard>
                <svelte:fragment slot="left">
                  <span uk-icon="table" class="uk-margin-right" />
                  <span>{criterion.title}</span>
                </svelte:fragment>
                <svelte:fragment slot="right">
                  <More
                    onDelete={() => removeCriterion(criterion)}
                    onEdit={() => editTitle(criterion)}
                  />
                </svelte:fragment>
              </ListCard>
            </SortableItem>
          {/each}
        </SortableList>
      </SortableItem>
    {/each}
  </SortableList>
  <div class="uk-text-muted uk-text-center uk-margin">
    <b>Least</b> important
  </div>
{/if}

<NextBack
  back={{ label: "Options", event: { type: "OPTIONS" } }}
  next={{ label: "Ratings", event: { type: "RATINGS" } }}
/>
