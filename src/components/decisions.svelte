<script lang="ts">
  import { addDecision, removeDecision, updateDecision } from "../service/db";
  import { send } from "../machine";
  import type { Decision } from "../types/data";
  import type { DecisionsLoadedState } from "../types/state";
  import Create from "./create.svelte";
  import ListCard from "./list-card.svelte";
  import More from "./more.svelte";
  import PromptModal from "./prompt-modal.svelte";

  export let state: DecisionsLoadedState;

  let onModalSubmit: (value: string) => void = () => undefined;
  let modal: PromptModal;
  let modalValue: string;

  function addAndLoad(title: string) {
    if (!title) {
      return;
    }
    const decisionId = addDecision(state.context.user, title);
    send({ type: "CREATING", decisionId });
  }

  function onCreateClick() {
    modalValue = "";
    onModalSubmit = addAndLoad;
    modal.show();
  }

  function onEditClick(decision: Decision) {
    modalValue = decision.title;
    onModalSubmit = (value) => {
      decision.title = value;
      updateDecision(decision);
    };
    modal.show();
  }

  $: creator = [...state.context.creatorDecisions].sort(
    (a, b) => b.created - a.created
  );

  $: collaborator = [...state.context.collaboratorDecisions].sort(
    (a, b) => b.created - a.created
  );
</script>

<Create
  label="Create a decision"
  onSubmit={addAndLoad}
  placeholder="Dinner, Vacation, etc."
/>

<h5 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Open an existing decision</span>
</h5>

{#if creator.length === 0 && collaborator.length === 0}
  <div class="uk-card uk-placeholder uk-card-body uk-text-center">
    <p>Create your first decision to get started</p>
    <button class="uk-button uk-button-primary" on:click={onCreateClick}>
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
            onEdit={() => onEditClick(decision)}
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

<PromptModal
  bind:this={modal}
  bind:value={modalValue}
  onSubmit={onModalSubmit}
  title="Decision Title"
/>
