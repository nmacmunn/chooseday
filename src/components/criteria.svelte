<script lang="ts">
  import _ from "lodash";
  import {
    addCriterion,
    removeCriterion,
    updateCriterion,
  } from "../service/db";
  import type { Criterion } from "../types/data";
  import type { CriteriaState } from "../types/state";
  import Alert from "./alert.svelte";
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

  $: byWeight = _(state.context.userCriteria)
    .groupBy("weight")
    .values()
    .orderBy("0.weight", "desc")
    .value();

  let top: SortableList;
</script>

{#if state.context.userCriteria.length < 2}
  <Alert>
    <span uk-icon="info" class="uk-margin-right" />
    Create at least {state.context.userCriteria.length
      ? "one more criterion"
      : "two criteria"}
  </Alert>
{/if}

<Create
  label="Add criteria"
  placeholder="Cost, nutrition, delivery time, etc."
  onSubmit={(title) =>
    addCriterion(state.context.decision.id, title, state.context.user)}
/>

<h4 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Criteria</span>
</h4>

<h5 class="uk-text-light">
  <span>Sort from most to least important</span>
</h5>

<div
  class="uk-dark uk-background-muted uk-text-center uk-padding-small"
  style="margin-bottom: -10px"
>
  <i>Most important</i>
</div>
<div
  class="uk-padding uk-padding-remove-top uk-padding-remove-bottom"
  style="background-image: linear-gradient(0, transparent, #f8f8f8)"
>
  <SortableList bind:this={top}>
    {#if byWeight.length === 0}
      <PlaceholderCard>No criteria yet</PlaceholderCard>
    {/if}
    {#each byWeight as criteria ({})}
      <SortableItem>
        <SortableList on:sorted={onSorted}>
          {#each criteria as criterion (criterion)}
            <SortableItem data={criterion}>
              <ListCard>
                <svelte:fragment slot="left">
                  <span uk-icon="table" class="uk-margin-right" />
                  <span>{criterion.title}</span>
                </svelte:fragment>
                <svelte:fragment slot="right">
                  <More
                    actions={[
                      {
                        title: "Edit",
                        icon: "pencil",
                        callback: () => editTitle(criterion),
                      },
                      {
                        title: "Delete",
                        icon: "trash",
                        callback: () => removeCriterion(criterion),
                      },
                    ]}
                  />
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
  <i>Least important</i>
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
