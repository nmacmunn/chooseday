<script lang="ts">
  import UIkit from "uikit";
  import { addDecision, removeDecision, updateDecision } from "../service/db";
  import { send } from "../machine";
  import type { Decision } from "../types/data";
  import type { DecisionsState } from "../types/state";
  import Create from "./create.svelte";
  import ListCard from "./list-card.svelte";
  import More from "./more.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";

  export let state: DecisionsState;

  let decisionId: string | undefined;

  async function onClick() {
    const title = await UIkit.modal.prompt("Decision title", "");
    if (title) {
      addAndLoad(title);
    }
  }

  let dialog: any;
  async function addAndLoad(title: string) {
    dialog = await UIkit.modal.dialog(`
      <div class="uk-modal-body">
        <span uk-spinner class="uk-margin-right"></span>
        <span>Creating ${title}</span>
      </div>
      `);
    decisionId = await addDecision(state.context.user, title);
  }

  async function editTitle(decision: Decision) {
    const result = await UIkit.modal.prompt("Title", decision.title);
    if (typeof result == "string") {
      decision.title = result;
      updateDecision(decision);
    }
  }

  $: if (decisionId && state.context.creatorDecisions) {
    const decision = state.context.creatorDecisions.find(
      ({ id }) => decisionId === id
    );
    if (decision) {
      if (dialog) {
        debugger;
        UIkit.modal(dialog.$el).hide();
      }
      send({ type: "DECISION", decision });
    }
  }

  $: creator = state.context.creatorDecisions
    ? [...state.context.creatorDecisions].sort((a, b) => b.created - a.created)
    : undefined;

  $: collaborator = state.context.collaboratorDecisions
    ? [...state.context.collaboratorDecisions].sort(
        (a, b) => b.created - a.created
      )
    : undefined;
</script>

<Create
  label="Create a decision"
  onSubmit={addAndLoad}
  placeholder="Dinner, Vacation, etc."
/>

<h5 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Open an existing decision</span>
</h5>

{#if !creator || !collaborator}
  <PlaceholderCard>
    <span uk-spinner class="uk-margin-right" />
    <span>Loading your decisions</span>
  </PlaceholderCard>
{:else if creator.length === 0 && collaborator.length === 0}
  <div class="uk-card uk-placeholder uk-card-body uk-text-center">
    <p>Create your first decision to get started</p>
    <button class="uk-button uk-button-primary" on:click={onClick}>
      Create
    </button>
  </div>
{:else}
  <ul class="uk-grid-small uk-child-width-1-1" uk-grid>
    {#each creator as decision (decision.id)}
      <li>
        <ListCard onClick={() => send({ type: "DECISION", decision })}>
          <div slot="left">{decision.title}</div>
          <More
            slot="right"
            onDelete={() => removeDecision(decision.id)}
            onEdit={() => editTitle(decision)}
          />
        </ListCard>
      </li>
    {/each}
    {#each collaborator as decision (decision.id)}
      <li>
        <ListCard onClick={() => send({ type: "DECISION", decision })}>
          <div slot="left">{decision.title}</div>
          <span slot="right" class="uk-label">collaborator</span>
        </ListCard>
      </li>
    {/each}
  </ul>
{/if}
