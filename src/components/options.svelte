<script lang="ts">
  import { addOption, removeOption, updateOption } from "../service/db";
  import type { Option } from "../types/data";
  import type { OptionsState } from "../types/state";
  import Create from "./create.svelte";
  import ListCard from "./list-card.svelte";
  import More from "./more.svelte";
  import NextBack from "./next-back.svelte";
  import PlaceholderCard from "./placeholder-card.svelte";
  import PromptModal from "./prompt-modal.svelte";

  export let state: OptionsState;

  let modal: PromptModal;
  let onModalSubmit: (value: string) => void = () => undefined;
  let modalValue: string;

  $: sorted = [...state.context.options].sort((a, b) => a.created - b.created);

  async function editTitle(option: Option) {
    modalValue = option.title;
    onModalSubmit = (title) => {
      if (title) {
        option.title = title;
        updateOption(option);
      }
    };
    modal.show();
  }

  const { decision, user } = state.context;
  const isCreator = decision.creator.id === user.id;
</script>

{#if isCreator}
  <Create
    label="Create an option"
    onSubmit={(title) => addOption(decision.id, title)}
    placeholder="Pizza, sushi, etc."
  />
{/if}

{#if sorted.length < 2}
  <div class="uk-alert uk-alert-primary">
    <span uk-icon="info" class="uk-margin-right" />
    <span
      >Create at least {sorted.length ? "one more option" : "two options"}</span
    >
  </div>
{/if}

<h4 class="uk-text-light uk-heading-line">
  <span class="uk-margin-left">Options</span>
</h4>

<ul class="uk-grid-small uk-child-width-1-1" uk-grid>
  {#if sorted.length === 0}
    <li>
      <PlaceholderCard>No options yet</PlaceholderCard>
    </li>
  {/if}
  {#each sorted as option (option.id)}
    <li>
      <ListCard>
        <span slot="left">{option.title}</span>
        <span slot="right">
          {#if isCreator}
            <div class="uk-width-auto">
              <More
                actions={[
                  {
                    title: "Edit",
                    icon: "pencil",
                    callback: () => editTitle(option),
                  },
                  {
                    title: "Delete",
                    icon: "trash",
                    callback: () => removeOption(option),
                  },
                ]}
              />
            </div>
          {/if}
        </span>
      </ListCard>
    </li>
  {/each}
</ul>

<NextBack
  back={{ label: "Decisions", event: { type: "DECISIONS" } }}
  next={{ label: "Criteria", event: { type: "CRITERIA" } }}
/>

<PromptModal
  bind:this={modal}
  bind:value={modalValue}
  onSubmit={onModalSubmit}
  title="Option Title"
/>
