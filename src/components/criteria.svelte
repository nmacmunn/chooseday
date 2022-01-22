<script lang="ts">
  import _ from "lodash";
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
  import PromptModal from "./prompt-modal.svelte";
  import SortableItem from "./sortable-item.svelte";
  import SortableList from "./sortable-list.svelte";

  export let state: CriteriaState;

  let modal: PromptModal;
  let onModalSubmit: (value: string) => void = () => undefined;
  let modalValue: string;

  async function editTitle(criterion: Criterion) {
    modalValue = criterion.title;
    onModalSubmit = (title) => {
      if (title) {
        criterion.title = title;
        updateCriterion(criterion);
      }
    };
    modal.show();
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

  $: all = state.context.criteria;
  $: byWeight = _.groupBy(all, "weight");
  $: weights = _.keys(byWeight).map(Number).sort().reverse();
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

{#if all.length < 2}
  <PlaceholderCard>
    <span uk-icon="info" class="uk-margin-right" />
    Create at least {all.length ? "one more criterion" : "two criteria"}
  </PlaceholderCard>
{/if}
<div class="uk-text-muted uk-text-center uk-margin">
  <b>Most</b> important
</div>
<SortableList bind:this={top}>
  {#each weights as weight ({})}
    <SortableItem>
      <SortableList on:sorted={onSorted}>
        {#each byWeight[weight] as criterion (criterion)}
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

<NextBack
  back={{ label: "Options", event: { type: "OPTIONS" } }}
  next={{ label: "Ratings", event: { type: "RATINGS" } }}
/>

<PromptModal
  bind:this={modal}
  bind:value={modalValue}
  onSubmit={onModalSubmit}
  title="Criterion Title"
/>
