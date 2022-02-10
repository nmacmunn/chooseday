<script lang="ts">
  import _ from "lodash";
  import { linkWithGoogle } from "../service/auth";
  import { enableCollaborators, removeCollaborator } from "../service/db";
  import type { CollaboratorsState } from "../types/state";
  import { hasEmail } from "../util/user";
  import ListCard from "./list-card.svelte";
  import More from "./more.svelte";
  import NextBack from "./next-back.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";

  export let state: CollaboratorsState;

  $: decision = state.context.decision;
  const isCreator = state.context.user.id === state.context.decision.creator.id;

  let copied = false;
  function copyUrl() {
    navigator.clipboard.writeText(window.location.href);
    copied = true;
  }

  $: collaborators = _.filter(decision.collaborators, "active");
</script>

{#if !hasEmail(state.context.user)}
  <div class="uk-alert uk-text-center">
    <p>You have to link to a Google account to invite collaborators</p>
    <button class="uk-button uk-button-primary" on:click={linkWithGoogle}>
      Link account
    </button>
  </div>
{:else if decision.collaborators === undefined}
  <div class="uk-alert uk-text-center">
    <p>Collaboration is not enabled for this decision</p>
    <button
      class="uk-button uk-button-primary"
      on:click={() => enableCollaborators(decision)}
    >
      Enable
    </button>
  </div>
{:else}
  <h4 class="uk-text-light uk-heading-line">
    <span class="uk-margin-left">Collaborators</span>
  </h4>
  {#if isCreator}
    <div
      class="uk-padding uk-text-center uk-flex uk-flex-center uk-flex-wrap"
      uk-margin
    >
      <input
        class="uk-input uk-width-1-2@s"
        disabled
        value={window.location.href}
      />
      <button
        class="uk-button"
        class:uk-button-primary={!copied}
        class:uk-button-default={copied}
        on:click={copyUrl}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <div class="uk-text-meta uk-width-1-1">
        Share this link to invite collaborators
      </div>
    </div>
  {/if}
  <ul class="uk-grid uk-grid-small uk-child-width-1-1" uk-grid>
    {#if collaborators.length === 0}
      <li>
        <PlaceholderCard>
          <span uk-icon="info" class="uk-margin-right" />
          <span>Nobody collaborating yet</span>
        </PlaceholderCard>
      </li>
    {/if}
    {#if !isCreator}
      <li>
        <ListCard>
          <span slot="left">{decision.creator.email}</span>
          <span slot="right" class="uk-label">creator</span>
        </ListCard>
      </li>
    {/if}
    {#each collaborators as collaborator}
      <li>
        <ListCard>
          <span slot="left">{collaborator.email}</span>
          <span slot="right">
            {#if isCreator}
              <More
                actions={[
                  {
                    title: "Remove",
                    icon: "ban",
                    callback: () => removeCollaborator(decision, collaborator),
                  },
                ]}
              />
            {/if}
          </span>
        </ListCard>
      </li>
    {/each}
  </ul>
{/if}

<NextBack
  back={{ label: "Ratings", event: { type: "RATINGS" } }}
  next={{ label: "Results", event: { type: "RESULTS" } }}
/>
