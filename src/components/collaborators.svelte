<script lang="ts">
  import UIkit from "uikit";
  import { updateDecision } from "../service/db";
  import type { CollaboratorsState } from "../types/state";
  import Create from "./create.svelte";
  import ListCard from "./list-card.svelte";
  import More from "./more.svelte";
  import NextBack from "./next-back.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";

  export let state: CollaboratorsState;

  $: decision = state.context.decision;
  const isCreator = state.context.user.id === state.context.decision.creator.id;

  function addCollaborator(email: string) {
    if (decision.collaborators.indexOf(email) !== -1) {
      return;
    }
    decision.collaborators.push(email);
    updateDecision(decision);
    decision = decision;
  }

  function removeCollaborator(index: number) {
    decision.collaborators.splice(index);
    updateDecision(decision);
    decision = decision;
  }

  async function editEmail(email: string, i: number) {
    const updated = await UIkit.modal.prompt("Title", email);
    if (typeof updated == "string") {
      decision.collaborators[i] = updated;
      updateDecision(decision);
      decision = decision;
    }
  }
</script>

{#if isCreator}
  <Create
    label="Add a collaborator (optional)"
    onSubmit={addCollaborator}
    placeholder="advisor@example.com"
  />
{/if}

<h5 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Who's deciding</span>
</h5>

{#if isCreator && decision.collaborators.length === 0}
  <PlaceholderCard>
    <span uk-icon="info" class="uk-margin-right" />
    <span>Enter an email address to add a collaborator</span>
  </PlaceholderCard>
{/if}

<ul class="uk-grid uk-grid-small uk-child-width-1-1" uk-grid>
  {#each decision.collaborators as email, i}
    <li>
      <ListCard>
        <span slot="left">{email}</span>
        <span slot="right">
          {#if isCreator}
            <More
              onDelete={() => removeCollaborator(i)}
              onEdit={() => editEmail(email, i)}
            />
          {/if}
        </span>
      </ListCard>
    </li>
  {/each}
</ul>

<NextBack
  back={{ label: "Ratings", event: { type: "RATINGS" } }}
  next={{ label: "Results", event: { type: "RESULTS" } }}
/>
